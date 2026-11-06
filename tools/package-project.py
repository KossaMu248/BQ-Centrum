#!/usr/bin/env python3
"""Create a deterministic standalone delivery using an explicit project allowlist.

Required assets/cache files are immutable authored runtime render outputs, not
browser or build caches. Development caches, donor inspection archives and Git
metadata are never included. No source tree, remote or deployment is modified.
"""
import argparse
import gzip
import hashlib
import json
import re
import struct
import zipfile
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORIES = ('assets', 'css', 'js', 'references/source')
DOCUMENTS = ('README.md', 'AGENTS.md', 'SOURCE_BASELINE.md', 'PROGRESS.md',
             'TEST_REPORT.md', 'GITHUB_PUBLICATION.md', 'index.html', 'autumn-v19.html', 'autumn-version.json', '.nojekyll')
FORBIDDEN_PARTS = {'.git', '.baseline', '__pycache__', 'node_modules', '.pytest_cache', '.mypy_cache', '.DS_Store'}
SECRET_NAMES = {'.env', '.env.local', 'credentials', 'credentials.json', 'id_rsa', 'id_ed25519', '.netrc', '.npmrc'}
SECRET_PATTERNS = {
    'private-key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'),
    'github-token': re.compile(r'\b(?:gh[pousr]_[A-Za-z0-9]{30,255}|github_pat_[A-Za-z0-9_]{50,255})\b'),
    'aws-access-key': re.compile(r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'google-api-key': re.compile(r'\bAIza[0-9A-Za-z_-]{35}\b'),
}
TEXT_EXTENSIONS = {'.js', '.css', '.html', '.json', '.md', '.txt', '.py', '.cjs', '.yml', '.yaml'}
EVIDENCE_STAGES = (7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21)
VALIDATION_STAGE = 21


def valid_file(path):
    relative = path.relative_to(ROOT)
    if path.is_symlink():
        raise ValueError('Symlink is not allowed in delivery: ' + str(relative))
    if any(p in FORBIDDEN_PARTS for p in relative.parts) or path.name in SECRET_NAMES or path.suffix in {'.pyc', '.pyo', '.pem', '.key'}:
        raise ValueError('Forbidden package path: ' + str(relative))
    if not path.is_file():
        return False
    text = None
    if path.suffix == '.gz':
        if relative.parts[0] != 'verification' or not path.name.endswith('.json.gz'):
            raise ValueError('Unsupported compressed evidence path: ' + str(relative))
        try:
            text = gzip.decompress(path.read_bytes()).decode('utf-8')
            json.loads(text)
        except (OSError, EOFError, UnicodeError, ValueError, zlib.error) as error:
            raise ValueError('Invalid compressed JSON evidence: ' + str(relative)) from error
    elif path.suffix in TEXT_EXTENSIONS:
        text = path.read_text(errors='replace')
    if text is not None:
        for category, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                raise ValueError('Credential-pattern check failed: ' + category + ' in ' + str(relative))
    return True


def scenery_audit():
    """Keep new scenery provenance separate from the pinned donor asset set."""
    directory=ROOT/'assets/centrum'
    files=sorted(directory.glob('*.png')) if directory.exists() else []
    if not files:return {}
    provenance=directory/'PROVENANCE.md'
    if not provenance.is_file():raise ValueError('New scenery requires assets/centrum/PROVENANCE.md')
    text=provenance.read_text();result={}
    for path in files:
        data=path.read_bytes();digest=hashlib.sha256(data).hexdigest()
        if data[:8]!=b'\x89PNG\r\n\x1a\n':raise ValueError('Invalid scenery PNG: '+path.name)
        if digest not in text or path.name not in text:raise ValueError('Scenery provenance hash is stale: '+path.name)
        result[path.relative_to(ROOT).as_posix()]={'sha256':digest,'nativePixels':list(struct.unpack('>II',data[16:24]))}
    return result


def actor_audit():
    """Record approved new bear-view PNGs separately from original art/scenery.

    Hash/provenance metadata is not a visual claim about likeness, missing baby
    pixels or animation. Those require the separately recorded gameplay review.
    """
    directory=ROOT/'assets/centrum/actors'
    if not directory.exists():return {}
    images=sorted(p for p in directory.rglob('*') if p.is_file() and p.suffix.lower() in {'.png','.webp','.jpg','.jpeg','.gif','.avif'})
    if not images:return {}
    provenance=directory/'PROVENANCE.md'
    if not provenance.is_file():raise ValueError('New bear-angle artwork requires assets/centrum/actors/PROVENANCE.md')
    text=provenance.read_text();result={}
    for path in images:
        if path.suffix.lower()!='.png':raise ValueError('Bear-angle runtime artwork must use documented lossless PNG: '+path.name)
        data=path.read_bytes();digest=hashlib.sha256(data).hexdigest()
        if len(data)<33 or data[:8]!=b'\x89PNG\r\n\x1a\n' or data[12:16]!=b'IHDR':raise ValueError('Invalid actor PNG: '+path.name)
        width,height=struct.unpack('>II',data[16:24]);color_type=data[25]
        if not width or not height:raise ValueError('Actor PNG must have positive dimensions: '+path.name)
        if not any(path.name in line and digest in line for line in text.splitlines()):raise ValueError('Bear-angle provenance hash is stale: '+path.name)
        result[path.relative_to(ROOT).as_posix()]={'sha256':digest,'nativePixels':[width,height],
            'pngColorType':color_type,'alphaChannel':color_type in {4,6},
            'provenance':'assets/centrum/actors/PROVENANCE.md',
            'scope':'User-approved additional bear-only views; original baby remains source artwork. Metadata validation is separate from visual/gameplay acceptance.'}
    return result


def included_files():
    files = set()
    for name in DOCUMENTS:
        p = ROOT / name
        if p.exists():
            files.add(p)
    for directory in DIRECTORIES:
        files.update(p for p in (ROOT / directory).rglob('*') if p.is_file())
    # Retain reviewable development checks, not historical donor tooling/builds.
    files.update((ROOT / 'tests').glob('*.cjs'))
    files.update((ROOT / 'tests').glob('centrum*.py'))
    for name in ['tools/verify-source-integrity.py', 'tools/package-project.py', 'tools/stage-pages.py', 'tests/wrong_entrance.py']:
        if (ROOT / name).is_file():
            files.add(ROOT / name)
    # Preserve source/art review and validation alongside current final evidence
    # and the honest pre-generation environmental-art audit.
    for stage in EVIDENCE_STAGES:
        folder = ROOT / 'verification' / ('stage' + str(stage))
        if folder.exists():
            files.update(p for p in folder.rglob('*') if p.is_file())
    # Intermediate work products and large raw frame sequences are not evidence.
    files = {p for p in files if not any(part in {'raw-video', 'raw-frames', 'frames', 'work', 'unpacked', 'server-root', 'scratch', 'drafts', 'browser-cache', 'browser-profile', 'user-data-dir', 'recordings'} for part in p.relative_to(ROOT).parts)
             and not any(part.startswith('.') and part!='.nojekyll' for part in p.relative_to(ROOT).parts)
             and p.suffix not in {'.log', '.tmp'} and p.name not in {'package-audit.json','live-progress.json'} and not p.name.startswith('.DS_Store')}
    # The certificate for testing this ZIP is external to that same ZIP. Keep
    # its explanatory page, but never ship a stale earlier-package certificate.
    for stage in EVIDENCE_STAGES:
        certificate=ROOT/'verification'/('stage'+str(stage))/'standalone'
        files={p for p in files if not p.is_relative_to(certificate) or p.name=='README.md'}
    # Modern review stages retain only final evidence/art audits/docs. Source
    # capture helpers and renderer HTML fixtures remain development-only.
    for stage in EVIDENCE_STAGES:
        if stage<9:continue
        review=ROOT/'verification'/('stage'+str(stage))
        files={p for p in files if not p.is_relative_to(review) or (
            (p.suffix in {'.md','.json','.png','.jpg','.jpeg','.webp','.webm','.mp4','.sha256'} or p.name.endswith('.json.gz')) and
            not any(label in part.lower() for part in p.relative_to(review).parts for label in ['-provisional','-attempt']) and
            not any(part.lower() in {'setup','calibration'} for part in p.relative_to(review).parts))}
    return sorted((p for p in files if valid_file(p)), key=lambda p:p.relative_to(ROOT).as_posix())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', default='delivery/BQ-Centrum-validated.zip')
    parser.add_argument('--audit-only', action='store_true')
    args = parser.parse_args()
    output = (ROOT / args.output).resolve()
    if not output.is_relative_to(ROOT) or output.suffix != '.zip':
        raise SystemExit('Output must be a .zip inside BQ-Centrum')
    files = included_files()
    scenery=scenery_audit();actors=actor_audit()
    hashes = {p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
    total = sum(p.stat().st_size for p in files)
    docs = '''# Standalone package contents\n\nExtract this archive, enter BQ-Centrum, then run `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000/. No install/build/donor checkout is required. Read README.md for controls and TEST_REPORT.md for current validation conditions/limits.\n\nThis package includes the split local runtime, both small active HTML entry files, all required source artwork, attribution/baseline references, selected tests and the latest art/delivery evidence. Earlier development evidence remains in the workspace, outside this delivery. The standalone ZIP-validation certificate, screenshots and archive SHA sidecar are external to the ZIP they validate, avoiding stale/self-referential certificates; the included TEST_REPORT.md summarizes the actual test conditions.\n\nExcluded: donor inspection archive/copy (.baseline), all Git metadata, credentials, Python/browser/build caches, obsolete HTML builds and temporary/raw recording frames. The `assets/cache` directory is intentionally retained: its immutable source-authored prepared PNGs/manifests are runtime assets, with original-art fallbacks; it is not a disposable development cache. Original source assets remain intact. Additional explicitly approved bear-only toward/away artwork is documented separately in assets/centrum/actors/PROVENANCE.md; the baby keeps the original source artwork and renderer. Independent environmental artwork is documented in assets/centrum/PROVENANCE.md.\n\nOriginal game/code/art remain attributable to KossaMu248/BQ and the pinned KossaMu248/BQ-Autumn commit in SOURCE_BASELINE.md. This package neither grants new rights nor alters that attribution. This packaging tool performs no remote or deployment operation. Authorized target-repository publication history is recorded in README.md and PROGRESS.md; neither donor is a destination.\n'''
    package_manifest = {'format':1, 'project':'BQ-Centrum', 'root':'BQ-Centrum/', 'runtimeFilesAndReviewEvidence':len(files), 'uncompressedBytes':total,
                        'files':hashes, 'excludes':['.git','.baseline','development caches','obsolete HTML','raw recording frames'],
                        'requiredPreparedRuntimeAssetsRetained':'assets/cache/','evidenceStages':list(EVIDENCE_STAGES),'independentScenery':scenery,'approvedBearAngleArtwork':actors}
    if args.audit_only:
        print(json.dumps({'passed':True,'files':len(files),'uncompressedBytes':total,'htmlFiles':[x for x in hashes if x.endswith('.html')],
                          'forbiddenPaths':[],'credentialPatterns':[],'requiredPreparedAssets':sum(x.startswith('assets/cache/') for x in hashes),'independentScenery':scenery,'approvedBearAngleArtwork':actors},indent=2))
        return
    output.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
        def write(name,data):
            info=zipfile.ZipInfo('BQ-Centrum/'+name,date_time=(1980,1,1,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644 << 16;info.create_system=3
            archive.writestr(info,data,compress_type=zipfile.ZIP_DEFLATED,compresslevel=6)
        # Read each payload once for the digest actually delivered, even when
        # an independent verifier is still writing another evidence file.
        hashes={};total=0
        for p in files:
            name=p.relative_to(ROOT).as_posix();data=p.read_bytes();total+=len(data)
            hashes[name]=hashlib.sha256(data).hexdigest();write(name,data)
        package_manifest['files']=hashes;package_manifest['uncompressedBytes']=total
        write('PACKAGE_CONTENTS.md',docs.encode())
        write('PACKAGE_MANIFEST.json',(json.dumps(package_manifest,indent=2)+'\n').encode())
    hasher=hashlib.sha256()
    with output.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b''):hasher.update(chunk)
    digest=hasher.hexdigest()
    output.with_suffix('.zip.sha256').write_text(digest+'  '+output.name+'\n')
    report={'passed':True,'archive':str(output.relative_to(ROOT)),'sha256':digest,'zipBytes':output.stat().st_size,'uncompressedBytes':total,
            'files':len(files)+2,'htmlFiles':[x for x in hashes if x.endswith('.html')],'forbiddenPaths':[],'credentialPatterns':[],'independentScenery':scenery,'approvedBearAngleArtwork':actors}
    report_path=ROOT/'verification'/('stage'+str(VALIDATION_STAGE))/'standalone/package-audit.json';report_path.parent.mkdir(parents=True,exist_ok=True);report_path.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))


if __name__=='__main__':
    main()
