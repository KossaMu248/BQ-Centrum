#!/usr/bin/env python3
"""Create a deterministic standalone delivery using an explicit project allowlist.

Required assets/cache files are immutable authored runtime render outputs, not
browser or build caches. Development caches, donor inspection archives and Git
metadata are never included. No source tree, remote or deployment is modified.
"""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORIES = ('assets', 'css', 'js', 'references/source')
DOCUMENTS = ('README.md', 'AGENTS.md', 'SOURCE_BASELINE.md', 'PROGRESS.md',
             'TEST_REPORT.md', 'index.html', 'autumn-v19.html', 'autumn-version.json', '.nojekyll')
FORBIDDEN_PARTS = {'.git', '.baseline', '__pycache__', 'node_modules', '.pytest_cache', '.mypy_cache', '.DS_Store'}
SECRET_NAMES = {'.env', '.env.local', 'credentials', 'credentials.json', 'id_rsa', 'id_ed25519', '.netrc', '.npmrc'}
SECRET_PATTERNS = {
    'private-key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'),
    'github-token': re.compile(r'\b(?:gh[pousr]_[A-Za-z0-9]{30,255}|github_pat_[A-Za-z0-9_]{50,255})\b'),
    'aws-access-key': re.compile(r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'google-api-key': re.compile(r'\bAIza[0-9A-Za-z_-]{35}\b'),
}
TEXT_EXTENSIONS = {'.js', '.css', '.html', '.json', '.md', '.txt', '.py', '.cjs', '.yml', '.yaml'}


def valid_file(path):
    relative = path.relative_to(ROOT)
    if path.is_symlink():
        raise ValueError('Symlink is not allowed in delivery: ' + str(relative))
    if any(p in FORBIDDEN_PARTS for p in relative.parts) or path.name in SECRET_NAMES or path.suffix in {'.pyc', '.pyo', '.pem', '.key'}:
        raise ValueError('Forbidden package path: ' + str(relative))
    if not path.is_file():
        return False
    if path.suffix in TEXT_EXTENSIONS:
        text = path.read_text(errors='replace')
        for category, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                raise ValueError('Credential-pattern check failed: ' + category + ' in ' + str(relative))
    return True


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
    for name in ['tools/verify-source-integrity.py', 'tools/package-project.py', 'tests/wrong_entrance.py']:
        if (ROOT / name).is_file():
            files.add(ROOT / name)
    # Stage 7 is the final art review; Stage 8 is the current delivery validation.
    for stage in [7, 8]:
        folder = ROOT / 'verification' / ('stage' + str(stage))
        if folder.exists():
            files.update(p for p in folder.rglob('*') if p.is_file())
    # Intermediate work products and large raw frame sequences are not evidence.
    files = {p for p in files if not any(part in {'raw-video', 'raw-frames', 'frames', 'work', 'unpacked', 'server-root'} for part in p.relative_to(ROOT).parts)
             and not any(part.startswith('.') and part!='.nojekyll' for part in p.relative_to(ROOT).parts)
             and p.suffix not in {'.log', '.tmp'} and p.name not in {'package-audit.json','live-progress.json'} and not p.name.startswith('.DS_Store')}
    # The certificate for testing this ZIP is external to that same ZIP. Keep
    # its explanatory page, but never ship a stale earlier-package certificate.
    certificate=ROOT/'verification/stage8/standalone'
    files={p for p in files if not p.is_relative_to(certificate) or p.name=='README.md'}
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
    hashes = {p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
    total = sum(p.stat().st_size for p in files)
    docs = '''# Standalone package contents\n\nExtract this archive, enter BQ-Centrum, then run `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000/. No install/build/donor checkout is required. Read README.md for controls and TEST_REPORT.md for current validation conditions/limits.\n\nThis package includes the split local runtime, both small active HTML entry files, all required source artwork, attribution/baseline references, selected tests and the latest art/delivery evidence. Earlier development evidence remains in the workspace, outside this delivery. The standalone ZIP-validation certificate, screenshots and archive SHA sidecar are external to the ZIP they validate, avoiding stale/self-referential certificates; the included TEST_REPORT.md summarizes the actual test conditions.\n\nExcluded: donor inspection archive/copy (.baseline), all Git metadata, credentials, Python/browser/build caches, obsolete HTML builds and temporary/raw recording frames. The `assets/cache` directory is intentionally retained: its immutable source-authored prepared PNGs/manifests are runtime assets, with original-art fallbacks; it is not a disposable development cache. No source characters were replaced.\n\nOriginal game/code/art remain attributable to KossaMu248/BQ and the pinned KossaMu248/BQ-Autumn commit in SOURCE_BASELINE.md. This package neither grants new rights nor alters that attribution. No remote push, publication or deployment was performed.\n'''
    package_manifest = {'format':1, 'project':'BQ-Centrum', 'root':'BQ-Centrum/', 'runtimeFilesAndReviewEvidence':len(files), 'uncompressedBytes':total,
                        'files':hashes, 'excludes':['.git','.baseline','development caches','obsolete HTML','raw recording frames'],
                        'requiredPreparedRuntimeAssetsRetained':'assets/cache/'}
    if args.audit_only:
        print(json.dumps({'passed':True,'files':len(files),'uncompressedBytes':total,'htmlFiles':[x for x in hashes if x.endswith('.html')],
                          'forbiddenPaths':[],'credentialPatterns':[],'requiredPreparedAssets':sum(x.startswith('assets/cache/') for x in hashes)},indent=2))
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
            'files':len(files)+2,'htmlFiles':[x for x in hashes if x.endswith('.html')],'forbiddenPaths':[],'credentialPatterns':[]}
    report_path=ROOT/'verification/stage8/standalone/package-audit.json';report_path.parent.mkdir(parents=True,exist_ok=True);report_path.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))


if __name__=='__main__':
    main()
