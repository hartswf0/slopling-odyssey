#!/usr/bin/env python3
"""Build player/staging.json and copy the native PNGs the player needs into player/assets/.

Inputs (all already in this repository):
  registry/story/ODYSSEY_V3_SCENE_DEPENDENCIES.json  beat -> authored kit ids
  registry/story/ODYSSEY_V3_PACKET_CROSSWALK.json    kit id -> candidate packets
  registry/packets/*/PACKET.json                      packet -> native asset records
  production/Slopling_Cutout_Packets_v1/ASSET_INDEX.csv (run tools/restore_packets.py first)

Native bytes are copied unchanged as assets/<sha256>.png and recorded in
player/assets/SELECTION.json with packet, source member and hash, per docs/ASSET_POLICY.md.
"""
from pathlib import Path
import csv, hashlib, json, shutil, sys

ROOT = Path(__file__).resolve().parents[1]
PLAYER = ROOT / 'player'
PROD = ROOT / 'production' / 'Slopling_Cutout_Packets_v1'

# Authored overrides where the crosswalk has no place, or proposes the wrong cast.
PLACE = {
    'beat_4': 'place_family_home', 'beat_16': 'place_work_office', 'beat_16r': 'place_work_office',
    'beat_16a': 'place_work_office', 'beat_16b': 'place_work_office', 'beat_17': 'place_work_office',
    'beat_18': 'place_ferry_cafe', 'beat_19': 'place_ferry_cafe', 'beat_19ai': 'place_ferry_cafe', 'beat_20': 'place_ferry_cafe',
    'beat_21': 'place_aiaia_offsite', 'beat_22': 'place_voyage_ship_sea', 'beat_23': 'place_voyage_ship_sea',
    'beat_24': 'place_voyage_ship_sea', 'beat_60': 'place_voyage_ship_sea', 'beat_61': 'place_voyage_ship_sea',
    'beat_62': 'place_family_home', 'beat_63': 'place_voyage_ship_sea', 'beat_64': 'place_work_office',
    'beat_77': 'place_work_office', 'beat_78': 'place_work_office', 'beat_80': 'place_work_office', 'beat_81': 'place_work_office',
    'beat_82': 'place_work_office', 'beat_83': 'place_work_office', 'beat_84': 'place_work_office', 'beat_85': 'place_work_office',
    'beat_86': 'place_work_office', 'beat_87': 'place_work_office', 'beat_88': 'place_work_office', 'beat_89': 'place_work_office',
    'beat_90': 'place_train', 'beat_91': 'place_train', 'beat_92': 'place_train',
    'beat_73': 'place_vision_ithaca', 'beat_74': 'place_vision_forge', 'beat_75': 'place_wayfinding_sea',
    'beat_48': 'place_wayfinding_sea',
}
CAST = {
    'beat_0': [], 'beat_4': ['char_player', 'char_father'], 'beat_21': ['char_player', 'extra_circe'],
    'beat_37': ['char_player', 'char_sutskov'], 'beat_38': ['char_player', 'char_sutskov'],
    'beat_43': ['char_player', 'char_hassaby'], 'beat_44': ['char_player', 'char_hassaby'],
    'beat_47': ['char_player', 'extra_compagnon_carpenter', 'extra_potter_teacher'], 'beat_48': ['char_player'],
    'beat_49': ['char_player'], 'beat_50': ['char_player'], 'beat_51': ['char_player'],
    'beat_35': ['char_player', 'char_tomson', 'char_shanning'], 'beat_36': ['char_player', 'char_tomson', 'char_shanning'],
    'beat_62': ['char_player', 'char_father'], 'beat_64': ['char_chad', 'char_dougie', 'char_ines'],
    'beat_70': ['char_player', 'char_ajax'], 'beat_71': ['char_player', 'char_ajax'], 'beat_72': ['char_player', 'char_ajax'],
    'beat_73': ['char_player'], 'beat_74': ['char_player', 'char_ajax'], 'beat_75': ['char_player'], 'beat_76': ['char_player'],
}
ORCHARD = ['beat_93', 'beat_94', 'beat_95', 'beat_96', 'beat_97', 'beat_98', 'beat_99', 'beat_100', 'beat_101',
           'beat_102', 'beat_103', 'beat_104', 'beat_105', 'beat_106', 'beat_107']
NO_ODIE = {'beat_0', 'beat_64'}  # title card; the suitors' scene happens while he is away
ABSENT_FATHER = {'beat_8'}  # the calipers are his, but he is not in the flat
# Cast assembled from their scale-matched cards at the recorded anchors (motion test:
# player/tests/anchor-rig-test.html, proportion test: player/tests/proportion-test.html).
# Watson (char_player) uses his own working rig instead.
RIGGED = sorted(p.name for p in (ROOT / 'registry/packets').iterdir()
                if (p / 'historical_scale_metadata.json').exists() and p.name not in ('char_player', 'char_mother'))
MOTIFS = {'beat_12': ['motif_scylla', 'motif_charybdis'], 'beat_50': ['extra_dashboard_cyclops'], 'beat_51': ['extra_dashboard_cyclops', 'extra_kpi_sheep']}


def main():
    if not (PROD / 'ASSET_INDEX.csv').exists():
        sys.exit('Run python3 tools/restore_packets.py first (needs production/Slopling_Cutout_Packets_v1).')
    index = {r['id']: r for r in csv.DictReader((PROD / 'ASSET_INDEX.csv').open())}
    cw = {k['kit_id']: k['candidate_packet_ids'] for k in json.loads((ROOT / 'registry/story/ODYSSEY_V3_PACKET_CROSSWALK.json').read_text())}
    deps = json.loads((ROOT / 'registry/story/ODYSSEY_V3_SCENE_DEPENDENCIES.json').read_text())
    packets = {p.name: json.loads((p / 'PACKET.json').read_text()) for p in (ROOT / 'registry/packets').iterdir() if (p / 'PACKET.json').exists()}

    beats = {}
    for d in deps:
        cands = sorted({p for k in d['kit_ids'] for p in cw.get(k, [])})
        bid = d['beat_id']
        place = PLACE.get(bid) or ('place_orchard' if bid in ORCHARD else next((p for p in cands if p.startswith('place_')), None))
        cast = CAST.get(bid)
        if cast is None:
            cast = [p for p in cands if p.startswith('char_') and p != 'char_mother']
            if 'char_player' in cast:
                cast.remove('char_player'); cast.insert(0, 'char_player')
        if bid in ABSENT_FATHER and 'char_father' in cast:
            cast.remove('char_father')
        if bid not in NO_ODIE and 'char_player' not in cast:
            cast.insert(0, 'char_player')
        beats[bid] = {'place': place, 'cast': cast, 'motifs': MOTIFS.get(bid, [])}

    # Carry forward: a logic beat with no place keeps the previous stage.
    prev = None
    for bid in [d['beat_id'] for d in deps]:
        if beats[bid]['place'] is None:
            beats[bid]['place'] = prev
        prev = beats[bid]['place']

    selection, figures, sets = [], {}, {}

    def take(asset_id, packet, role):
        r = index.get(asset_id)
        if not r or not r['native_file']:
            return None
        src = PROD / r['native_file']
        sha = r['sha256_verified']
        if hashlib.sha256(src.read_bytes()).hexdigest() != sha:
            raise ValueError('hash mismatch ' + asset_id)
        dst = PLAYER / 'assets' / (sha + '.png')
        if not dst.exists():
            shutil.copyfile(src, dst)
        selection.append({'id': asset_id, 'packet': packet, 'role': role, 'sha256': sha, 'bank': r['bank'],
                          'view': r['view_label'], 'width': int(r['width']), 'height': int(r['height']),
                          'source_archive': r['source_archive'], 'source_member': r['source_member'],
                          'review_status': r['review_status']})
        return {'src': 'assets/' + sha + '.png', 'w': int(r['width']), 'h': int(r['height'])}

    actors = sorted({c for b in beats.values() for c in b['cast']} | {m for b in beats.values() for m in b['motifs']})
    for a in actors:
        ref = take(f'scaled::{a}::ASSEMBLED_REFERENCE.png', a, 'figure_card')
        if ref is None and a in packets:  # motifs and extras without a scale reference: first cutout
            for asset in packets[a]['assets']:
                if asset.get('is_cutout') and (ref := take(asset['id'], a, 'figure_card')):
                    break
        if ref:
            ref['name'] = packets.get(a, {}).get('name', a)
            figures[a] = ref
    # Anchor rigs: loose scale-matched cards plus their recorded anchors, for characters who must gesture.
    rigs = {}
    for a in [r for r in RIGGED if r in actors]:
        meta = json.loads((ROOT / 'registry/packets' / a / 'historical_scale_metadata.json').read_text())
        files = {}
        for part in meta['parts']:
            if '/' in part['file']:
                continue
            ref = take(f"scaled::{a}::{part['file']}", a, 'rig_part')
            if ref: files[part['part']] = ref['src']
        rigs[a] = {'meta': meta, 'files': files}
    for place in sorted({b['place'] for b in beats.values() if b['place']}):
        pk = packets.get(place)
        if not pk:
            continue
        cells = []
        for asset in pk['assets']:
            if asset.get('category') == 'set' or asset['id'].startswith(place + '__cell') or asset['id'].startswith('orchard_stage'):
                ref = take(asset['id'], place, 'set_piece')
                if ref:
                    ref['id'] = asset['id']; cells.append(ref)
        sets[place] = {'name': pk.get('name', place), 'pieces': cells}

    staging = {'schema': 'slopling.player.staging.v1',
               'note': 'Generated by tools/build_player_assets.py from the scene dependencies and packet crosswalk, with authored overrides. Bindings are staging choices for the player, not rig approvals.',
               'beats': beats, 'figures': figures, 'sets': sets, 'rigs': rigs}
    (PLAYER / 'staging.json').write_text(json.dumps(staging, indent=1))
    keep = {s['sha256'] + '.png' for s in selection} | {'SELECTION.json'}
    for f in (PLAYER / 'assets').iterdir():  # drop files a previous build selected
        if f.name not in keep:
            f.unlink()
    (PLAYER / 'assets' / 'SELECTION.json').write_text(json.dumps({'schema': 'slopling.player.selection.v1', 'assets': selection}, indent=1))
    print(f'{len(beats)} beats, {len(figures)} figure cards, {len(sets)} sets, {len(selection)} native files selected')


if __name__ == '__main__':
    main()
