#!/usr/bin/env python3
"""Stage the standalone runtime for Pages; leave development evidence in Git.

All authored runtime assets, including assets/cache, are retained byte for byte.
The output must be a new or empty directory inside this project's delivery/.
"""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORIES = ('assets', 'css', 'js', 'references/source')
DOCUMENTS = ('index.html', 'autumn-v19.html', 'autumn-version.json', '.nojekyll',
             'README.md', 'AGENTS.md', 'SOURCE_BASELINE.md', 'PROGRESS.md',
             'TEST_REPORT.md', 'GITHUB_PUBLICATION.md')
FORBIDDEN = {'.git', '.baseline', '__pycache__', 'node_modules', '.DS_Store',
             '.env', '.env.local', 'credentials', 'credentials.json', 'id_rsa',
             'id_ed25519', '.netrc', '.npmrc'}
TEXT_EXTENSIONS = {'.js', '.css', '.html', '.json', '.md', '.txt', '.svg'}
SECRETS = re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----|'
                     r'\b(?:gh[pousr]_[A-Za-z0-9]{30,255}|github_pat_[A-Za-z0-9_]{50,255})\b|'
                     r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b|\bAIza[0-9A-Za-z_-]{35}\b')
MAX_BYTES = 900 * 1024 * 1024


def collect(root):
    root = root.resolve()
    files = []
    for name in DIRECTORIES + DOCUMENTS:
        path = root / name
        if not path.exists() or path.is_symlink():
            raise ValueError('Required public path missing or linked: ' + name)
        candidates = [path] if path.is_file() else sorted(path.rglob('*'))
        for item in candidates:
            relative = item.relative_to(root)
            if item.is_symlink():
                raise ValueError('Public symlink is forbidden: ' + relative.as_posix())
            if any(p in FORBIDDEN for p in relative.parts) or item.suffix in {'.key', '.pem', '.pyc', '.pyo'}:
                raise ValueError('Forbidden public path: ' + relative.as_posix())
            if item.is_file():
                if item.suffix in TEXT_EXTENSIONS and SECRETS.search(item.read_text(errors='replace')):
                    raise ValueError('Credential-pattern check failed: ' + relative.as_posix())
                files.append(item)
    total = sum(path.stat().st_size for path in files)
    if total >= MAX_BYTES:
        raise ValueError('Runtime exceeds the 900 MiB publication budget')
    return sorted(files), total


def stage(root, output):
    root, output = root.resolve(), output.resolve()
    if not output.is_relative_to(root / 'delivery') or output == root / 'delivery':
        raise ValueError('Pages output must be a dedicated directory inside delivery/')
    files, total = collect(root)
    if output.exists() and (not output.is_dir() or any(output.iterdir())):
        raise ValueError('Pages output must be new or empty; existing files are preserved')
    output.mkdir(parents=True, exist_ok=True)
    hashes = {}
    for path in files:
        relative = path.relative_to(root)
        destination = output / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, destination)
        hashes[relative.as_posix()] = hashlib.sha256(destination.read_bytes()).hexdigest()
    report = {'schema': 1, 'fileCount': len(files), 'payloadBytes': total,
              'maxPayloadBytes': MAX_BYTES, 'files': hashes,
              'scope': 'Standalone runtime, original assets, attribution and source references; development evidence stays in the Git repository.'}
    (output / 'PAGES_CONTENTS.json').write_text(json.dumps(report, indent=2) + '\n')
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'delivery/pages-site')
    args = parser.parse_args()
    report = stage(ROOT, args.output)
    print(json.dumps({key: value for key, value in report.items() if key != 'files'}, indent=2))


if __name__ == '__main__':
    main()
