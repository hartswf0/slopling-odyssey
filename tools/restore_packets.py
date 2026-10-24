#!/usr/bin/env python3
"""Verify and restore the byte-preserved Slopling Odyssey asset packets."""
from pathlib import Path, PurePosixPath
import argparse, hashlib, json, shutil, stat, sys, zipfile, zlib
ROOT=Path(__file__).resolve().parents[1]
def selected(manifest,args):
    if args.family:return [a for a in manifest['archives']if a['id']=='family']
    if args.assemble_only or args.verify_only:return manifest['archives']
    return [a for a in manifest['archives']if a['id'].startswith('full-part-')]
def restore(entry,args):
    outdir=ROOT/'restored-downloads';out=outdir/entry['original_filename'];tmp=out.with_suffix(out.suffix+'.tmp');whole=hashlib.sha256();total=0
    if not args.verify_only:outdir.mkdir(exist_ok=True)
    target=None if args.verify_only else tmp.open('wb')
    try:
        for item in entry['chunks']:
            p=ROOT/item['path'];part=hashlib.sha256();count=0
            with p.open('rb')as f:
                while block:=f.read(1024*1024):
                    part.update(block);whole.update(block);count+=len(block);total+=len(block)
                    if target:target.write(block)
            if count!=item['byte_size']or part.hexdigest()!=item['sha256']:raise ValueError('Chunk checksum mismatch: '+str(p))
        if total!=entry['byte_size']or whole.hexdigest()!=entry['sha256']:raise ValueError('Archive checksum mismatch: '+entry['original_filename'])
    except Exception:
        if target:target.close()
        tmp.unlink(missing_ok=True)
        raise
    finally:
        if target and not target.closed:target.close()
    print('Verified:',entry['original_filename'])
    if args.verify_only:return
    if out.exists()and hashlib.sha256(out.read_bytes()).hexdigest()!=entry['sha256']:tmp.unlink();raise ValueError('Existing download differs; preserved: '+str(out))
    tmp.replace(out)
    if args.assemble_only:return
    destination=ROOT/'production';destination.mkdir(exist_ok=True)
    with zipfile.ZipFile(out)as z:
        for item in z.infolist():
            rel=PurePosixPath(item.filename)
            if rel.is_absolute()or'..'in rel.parts or stat.S_ISLNK(item.external_attr>>16):raise ValueError('Unsafe archive member: '+item.filename)
            p=destination.joinpath(*rel.parts)
            if not p.resolve().is_relative_to(destination.resolve()):raise ValueError('Unsafe extraction path')
            if item.is_dir():p.mkdir(parents=True,exist_ok=True);continue
            p.parent.mkdir(parents=True,exist_ok=True)
            if p.exists():
                crc=0;size=0
                with p.open('rb')as f:
                    while block:=f.read(1024*1024):crc=zlib.crc32(block,crc);size+=len(block)
                if size==item.file_size and crc==item.CRC:continue
                raise ValueError('Modified existing file preserved: '+str(p))
            with z.open(item)as src,p.open('wb')as dst:shutil.copyfileobj(src,dst)
    print('Extracted to:',destination)
def restore_support(args):
    entries=json.loads((ROOT/'archives/SUPPORT_FILES.json').read_text())
    for entry in entries:
        data=bytearray()
        for item in entry['chunks']:
            block=(ROOT/item['path']).read_bytes()
            if len(block)!=item['byte_size'] or hashlib.sha256(block).hexdigest()!=item['sha256']:raise ValueError('Support chunk checksum mismatch: '+item['path'])
            data.extend(block)
        if len(data)!=entry['byte_size'] or hashlib.sha256(data).hexdigest()!=entry['sha256']:raise ValueError('Support checksum mismatch: '+entry['path'])
        if not args.verify_only:
            target=ROOT/entry['path']
            if target.exists() and target.read_bytes()!=data:raise ValueError('Modified existing support file preserved: '+str(target))
            target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
        print('Verified support file:',entry['path'])
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--family',action='store_true',help='Restore only Amy, Mark and the Watson reference');p.add_argument('--assemble-only',action='store_true',help='Reconstruct ZIP downloads without extraction');p.add_argument('--verify-only',action='store_true',help='Check all chunks and whole archive hashes without writing downloads');args=p.parse_args()
    restore_support(args)
    m=json.loads((ROOT/'archives/MANIFEST.json').read_text())
    for a in selected(m,args):restore(a,args)
if __name__=='__main__':
    try:main()
    except (OSError,ValueError,zipfile.BadZipFile)as e:print('Restore stopped:',e,file=sys.stderr);sys.exit(1)
