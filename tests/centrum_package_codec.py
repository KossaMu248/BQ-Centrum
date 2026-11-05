"""Check lossless review-evidence encoding and the package's decoded secret scan.

This does not run the game or measure performance. Temporary malformed evidence
stays inside this target and is removed after each test.
"""
import gzip
import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('centrum_package', ROOT / 'tools/package-project.py')
PACKAGE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PACKAGE)


class EvidenceCodec(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='.codec-check-', dir=ROOT / 'verification')
        self.directory = Path(self.temporary.name)

    def tearDown(self):
        self.temporary.cleanup()

    def encoded(self, data, name='profile.json.gz'):
        path = self.directory / name
        path.write_bytes(gzip.compress(data, mtime=0))
        return path

    def test_exact_utf8_json_bytes_are_accepted(self):
        original = '{\n  "area": "Hässelby", "samples": [1, 2.5]\n}\n'.encode('utf-8')
        path = self.encoded(original)
        self.assertEqual(gzip.decompress(path.read_bytes()), original)
        self.assertTrue(PACKAGE.valid_file(path))

    def test_corrupt_gzip_crc_is_rejected(self):
        path = self.encoded(b'{"sample":1}\n')
        damaged = bytearray(path.read_bytes())
        damaged[-8] ^= 1
        path.write_bytes(damaged)
        with self.assertRaisesRegex(ValueError, 'Invalid compressed JSON'):
            PACKAGE.valid_file(path)

    def test_non_utf8_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Invalid compressed JSON'):
            PACKAGE.valid_file(self.encoded(b'{"area":"\xff"}'))

    def test_non_json_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Invalid compressed JSON'):
            PACKAGE.valid_file(self.encoded(b'not JSON'))

    def test_secret_inside_gzip_is_rejected(self):
        secret = 'ghp_' + 'A' * 36
        with self.assertRaisesRegex(ValueError, 'Credential-pattern check failed: github-token'):
            PACKAGE.valid_file(self.encoded(json.dumps({'token': secret}).encode()))

    def test_other_gzip_suffix_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unsupported compressed evidence path'):
            PACKAGE.valid_file(self.encoded(b'{}', 'profile.txt.gz'))

    def test_gzip_outside_verification_is_rejected(self):
        with tempfile.TemporaryDirectory(prefix='.codec-check-', dir=ROOT) as directory:
            path = Path(directory) / 'profile.json.gz'
            path.write_bytes(gzip.compress(b'{}', mtime=0))
            with self.assertRaisesRegex(ValueError, 'Unsupported compressed evidence path'):
                PACKAGE.valid_file(path)

    def test_five_delivered_profiles_retain_original_bytes_and_references(self):
        directory = ROOT / 'verification/stage16/performance'
        proof = json.loads((directory / 'PROFILE_ENCODING.json').read_text())
        comparison = json.loads((directory / 'comparison.json').read_text())
        self.assertEqual(len(proof['files']), 5)
        self.assertTrue(proof['allExactOriginalBytesVerified'])
        for entry in proof['files']:
            path = directory / entry['file']
            compressed = path.read_bytes()
            original = gzip.decompress(compressed)
            json.loads(original.decode('utf-8'))
            self.assertEqual(hashlib.sha256(compressed).hexdigest(), entry['compressedSHA256'])
            self.assertEqual(hashlib.sha256(original).hexdigest(), entry['decodedSHA256'])
            self.assertEqual(len(compressed), entry['compressedBytes'])
            self.assertEqual(len(original), entry['decodedBytes'])
            self.assertTrue(PACKAGE.valid_file(path))
            self.assertFalse(path.with_suffix('').exists())
            name = entry['profile']
            if name in comparison['profiles']:
                self.assertEqual(comparison['profiles'][name]['file'], path.name)
                self.assertEqual(comparison['profileSHA256'][name], entry['decodedSHA256'])
                self.assertEqual(comparison['compressedProfileSHA256'][name], entry['compressedSHA256'])
        self.assertEqual(proof['bytesSaved'], proof['originalBytes'] - proof['compressedBytes'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
