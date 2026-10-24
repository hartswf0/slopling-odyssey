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
    'beat_48': 'place_wayfinding_sea', 'beat_8': 'place_hendry_memory', 'beat_49': 'place_pottery',
}
# Beat 8 is a memory: his father as a young toolmaker at the Hendry works. Drawn in sepia.
MEMORY = {'beat_8': ['char_father']}
# The Road (beat 47) walks through four traditions; the stage slides through them as a panorama.
PANORAMA = {'beat_47': [
    {'place': 'place_craft_road', 'cast': ['extra_compagnon_carpenter', 'extra_compagnon_stonemason'], 'label': 'Compagnons du Devoir · Tour de France'},
    {'place': 'place_pottery', 'cast': ['extra_potter_teacher', 'extra_potter_apprentice'], 'label': 'A Living National Treasure, teaching'},
    {'place': 'place_ise', 'cast': ['extra_ise_carpenter'], 'label': 'Ise · rebuilt every twenty years'},
    {'place': 'place_ijazah', 'cast': ['extra_ijazah_teacher', 'extra_ijazah_student'], 'label': 'Ijazah · the chain of teachers'},
]}
# People the story invokes but who do not speak: crowds behind the cast, thinkers with name plaques.
CHORUS = {
    'beat_3': ['extra_office_chorus__worker_a', 'extra_office_chorus__worker_b', 'extra_office_chorus__worker_c', 'extra_office_chorus__worker_d'],
    'beat_5': ['extra_gilbert_ryle', 'extra_peder_naur'], 'beat_9': ['extra_david_graeber'],
    'beat_11': ['extra_hr_pair_a', 'extra_hr_pair_b'], 'beat_12': ['extra_hr_pair_a', 'extra_hr_pair_b'],
    'beat_13': ['extra_hr_pair_a', 'extra_hr_pair_b'], 'beat_14': ['extra_hr_pair_a', 'extra_hr_pair_b'],
    'beat_15a': ['extra_hr_pair_a', 'extra_hr_pair_b'], 'beat_15b': ['extra_hr_pair_a', 'extra_hr_pair_b'],
    'beat_16r': ['extra_office_chorus__worker_a', 'extra_office_chorus__worker_b', 'extra_office_chorus__worker_c'],
    'beat_16a': ['extra_office_chorus__worker_a', 'extra_office_chorus__worker_b', 'extra_office_chorus__worker_c'],
    'beat_21': ['extra_swine_lead_a', 'extra_swine_lead_b', 'extra_swine_lead_c'],
    'beat_37': ['extra_researcher_circle_a', 'extra_researcher_circle__worker_a', 'extra_researcher_circle__worker_b', 'extra_researcher_circle__worker_c'],
    'beat_38': ['extra_researcher_circle_a', 'extra_researcher_circle__worker_a', 'extra_researcher_circle__worker_b', 'extra_researcher_circle__worker_c'],
    'beat_39': ['extra_vane_colleagues_a', 'extra_vane_colleagues_b', 'extra_vane_colleagues_c'],
    'beat_40': ['extra_vane_colleagues_a', 'extra_vane_colleagues_b', 'extra_vane_colleagues_c'],
    'beat_47': ['extra_jean_lave', 'extra_etienne_wenger'],
    'beat_48': ['extra_mau', 'extra_hawaiian_navigator_learner'],
    'beat_49': ['extra_jean_lave', 'extra_etienne_wenger'],
    'beat_50': ['extra_james_scott', 'extra_hidden_engineers_a', 'extra_hidden_engineers__worker_c', 'extra_hidden_engineers__worker_d'],
    'beat_51': ['extra_james_scott', 'extra_hidden_engineers_a', 'extra_hidden_engineers__worker_c', 'extra_hidden_engineers__worker_d'],
    'beat_70': ['extra_reorg_shades_a', 'extra_reorg_shades__worker_a', 'extra_reorg_shades__worker_b', 'extra_reorg_shades__worker_c'],
    'beat_71': ['extra_reorg_shades_a', 'extra_reorg_shades__worker_a', 'extra_reorg_shades__worker_b', 'extra_reorg_shades__worker_c'],
    'beat_72': ['extra_reorg_shades_a', 'extra_reorg_shades__worker_a', 'extra_reorg_shades__worker_b', 'extra_reorg_shades__worker_c'],
    'beat_73': ['extra_odysseus', 'extra_odysseus_son'], 'beat_74': ['extra_ajax_apprentices_a', 'extra_ajax_apprentices__worker_c'],
    'beat_77': ['extra_office_chorus__worker_a', 'extra_office_chorus__worker_c', 'extra_vp'],
    'beat_78': ['extra_office_chorus__worker_a', 'extra_office_chorus__worker_c', 'extra_vp'],
    'beat_85': ['extra_next_junior', 'extra_peder_naur'], 'beat_88': ['extra_vp', 'extra_client'],
    'beat_104': ['extra_neighbours_a', 'extra_neighbours_b'],
}
# How a chorus behaves on stage. Thinkers carry a name plaque; Mau and the learner stand still, with respect.
CHORUS_MODE = {'beat_3': 'clap', 'beat_16r': 'clap', 'beat_16a': 'clap', 'beat_37': 'chant', 'beat_38': 'chant',
               'beat_70': 'shade', 'beat_71': 'shade', 'beat_72': 'shade', 'beat_48': 'still'}
THINKERS = {'extra_gilbert_ryle': 'Gilbert Ryle', 'extra_peder_naur': 'Peder Naur', 'extra_david_graeber': 'David Graeber',
            'extra_james_scott': 'James C. Scott', 'extra_jean_lave': 'Jean Lave', 'extra_etienne_wenger': 'Etienne Wenger',
            'extra_mau': 'Mau Piailug'}
# Native story props (props packet). These take precedence over cuts from the JPEG kit crops.
NATIVE_PROPS = {
    'journal_closed': 'orchard_prop_journal_closed', 'journal_open': 'orchard_prop_journal_open', 'journal_page': 'orchard_prop_journal_turning_page',
    'code_page': 'orchard_prop_code_page_insert', 'caliper_beam': 'orchard_prop_caliper_beam_fixed_jaw', 'caliper_jaw': 'orchard_prop_caliper_sliding_jaw',
    'graft_rootstock': 'orchard_prop_graft_rootstock', 'graft_scion': 'orchard_prop_graft_scion', 'graft_tape': 'orchard_prop_graft_wrapping_tape',
    'grafting_knife': 'orchard_prop_grafting_knife', 'rag': 'orchard_prop_wiping_rag', 'phone_mobile': 'orchard_prop_phone',
    'hand_book_left': 'orchard_prop_book_support_hand_left', 'hand_book_right': 'orchard_prop_book_support_hand_right',
    'hand_page': 'orchard_prop_page_turn_hand', 'hand_shoulder': 'orchard_prop_shoulder_contact_hand',
    'shield': 'asset__13698f84f1ddafc2', 'chisel': 'asset__e81aa16dfc7f33c9', 'clay_pot': 'asset__dde06d40b8d06ef6',
    'hammer': 'asset__0ff1059e09824b8e', 'flatwhite': 'asset__adb4d94ad3d959b9', 'framework_cup': 'asset__a02ce3b412dd3058',
    'journal_native': 'asset__705268d8949b1841', 'juggling_ball': 'asset__eecf036d714cbfde', 'keyboard': 'asset__dd353f3e612d16d6',
    'lanyard': 'asset__f09b7a3ab5ede08c', 'lead_badge': 'asset__1311319907d59c2e', 'maze': 'asset__218aa75f3c2c6542',
    'moly_native': 'asset__6d277be0c0f77367', 'offer_native': 'asset__1dffe2c915fd1ff3', 'smartphone': 'asset__d8bf36c71d2525c3',
    'potter_wheel': 'asset__00142aa35ebe7e99', 'research_hood': 'asset__527f79bd61ccf81c', 'timber_joint': 'asset__89103451200062da',
    'unicycle': 'asset__d65c36ae70b5449b', 'canoe': 'asset__0ad0db25925178b6', 'paddle': 'asset__45af945122279a56',
    'headset': 'asset__6a14bce94fc381d4', 'mallet': 'asset__3d3e67ed1cbdb103', 'hand_plane': 'asset__b4c61f3ca6677f8b',
    'calipers_native': 'asset__e2d385db95666c5b', 'graft_branch': 'asset__1cf7028796e72b34', 'grafting_knife_native': 'asset__089c0ff1733d4f9e',
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
NO_ODIE = {'beat_0', 'beat_64', 'beat_8'}  # title card; the suitors while he is away; his father's memory
ABSENT_FATHER = set()
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
        if bid in MEMORY:
            cast = list(MEMORY[bid])
        beats[bid] = {'place': place, 'cast': cast, 'motifs': MOTIFS.get(bid, []), 'chorus': CHORUS.get(bid, []),
                      'chorusMode': CHORUS_MODE.get(bid, 'idle'), 'memory': bid in MEMORY}
        if bid in PANORAMA:
            beats[bid]['panorama'] = PANORAMA[bid]

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

    actors = sorted({c for b in beats.values() for c in b['cast'] + b['chorus'] + b['motifs']}
                    | {c for b in beats.values() for seg in b.get('panorama', []) for c in seg['cast']})
    rigged = {r for r in RIGGED if r in actors}
    for a in actors:
        if a in rigged:  # drawn from its rig; keep only the card's size for staging
            r = index.get(f'scaled::{a}::ASSEMBLED_REFERENCE.png')
            if r:
                figures[a] = {'src': None, 'w': int(r['width']), 'h': int(r['height']), 'name': packets.get(a, {}).get('name', a)}
                continue
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
    nprops = {}
    wanted = {v[len('native:'):] for v in json.loads((PLAYER / 'props.json').read_text())['names'].values() if v.startswith('native:')}
    for name, aid in NATIVE_PROPS.items():
        if name not in wanted:
            continue
        ref = take(aid, 'props', 'story_prop')
        if ref: nprops[name] = ref['src']
    places = {b['place'] for b in beats.values() if b['place']} | {seg['place'] for b in beats.values() for seg in b.get('panorama', [])}
    for place in sorted(places):
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
               'beats': beats, 'figures': figures, 'sets': sets, 'rigs': rigs, 'nativeProps': nprops, 'thinkers': THINKERS}
    (PLAYER / 'staging.json').write_text(json.dumps(staging, indent=1))
    keep = {s['sha256'] + '.png' for s in selection} | {'SELECTION.json'}
    for f in (PLAYER / 'assets').iterdir():  # drop files a previous build selected
        if f.name not in keep:
            f.unlink()
    (PLAYER / 'assets' / 'SELECTION.json').write_text(json.dumps({'schema': 'slopling.player.selection.v1', 'assets': selection}, indent=1))
    print(f'{len(beats)} beats, {len(figures)} figure cards, {len(sets)} sets, {len(selection)} native files selected')


if __name__ == '__main__':
    main()
