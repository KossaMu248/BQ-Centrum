"""Metadata guard tests for approved actor art, separate from visual acceptance.

Fixtures are synthetic one-pixel files under a disposable project-local folder;
no source/runtime image or donor file is modified. This does not test likeness.
"""
import hashlib
import importlib.util
import struct
import tempfile
import zlib
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('centrum_package',ROOT/'tools/package-project.py')
package=importlib.util.module_from_spec(spec);spec.loader.exec_module(package)

def png():
    def chunk(kind,payload):return struct.pack('>I',len(payload))+kind+payload+struct.pack('>I',zlib.crc32(kind+payload)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',1,1,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b'\0\0\0\0\0'))+chunk(b'IEND',b'')

def rejected(fn,fragment):
    try:fn()
    except ValueError as error:assert fragment in str(error),error
    else:raise AssertionError('Unreviewed actor provenance was accepted')

def main():
    work=ROOT/'.image-work';work.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='actor-provenance-',dir=work) as temporary:
        package.ROOT=Path(temporary)
        assert package.actor_audit()=={}
        actors=package.ROOT/'assets/centrum/actors';actors.mkdir(parents=True)
        image=actors/'bear-toward-test.png';image.write_bytes(png());digest=hashlib.sha256(image.read_bytes()).hexdigest()
        rejected(package.actor_audit,'requires assets/centrum/actors/PROVENANCE.md')
        provenance=actors/'PROVENANCE.md';provenance.write_text('Approved bear-only test metadata.\nbear-toward-test.png | '+'0'*64+'\n')
        rejected(package.actor_audit,'hash is stale')
        provenance.write_text('Approved bear-only test metadata.\nbear-toward-test.png | '+digest+'\n')
        result=package.actor_audit();assert list(result)==['assets/centrum/actors/bear-toward-test.png'];meta=next(iter(result.values()))
        assert meta['sha256']==digest and meta['nativePixels']==[1,1] and meta['alphaChannel']
        # Actor provenance cannot stand in for environment provenance or vice versa.
        env=package.ROOT/'assets/centrum';scenery=env/'gate-test.png';scenery.write_bytes(png());(env/'PROVENANCE.md').write_text('gate-test.png | '+digest+'\n')
        assert list(package.scenery_audit())==['assets/centrum/gate-test.png']
        assert list(package.actor_audit())==['assets/centrum/actors/bear-toward-test.png']
        bad=actors/'unreviewed.jpg';bad.write_bytes(b'not runtime PNG')
        rejected(package.actor_audit,'lossless PNG');bad.unlink()
        image.write_bytes(b'not a PNG');provenance.write_text(image.name+' | '+hashlib.sha256(image.read_bytes()).hexdigest()+'\n')
        rejected(package.actor_audit,'Invalid actor PNG')
    print('PASS: actor/environment provenance separation, valid PNG metadata, missing/stale provenance, unsupported formats and invalid headers; no visual acceptance implied.')

if __name__=='__main__':main()
