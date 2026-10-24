# Slopling Odyssey

Existing production cutouts, labeled character packets, source provenance, and the working Watson motion reference for **The Slopling’s Odyssey**.

## Start here

- [Amy and Mark preview catalog](catalogs/Amy_Mark_Cutout_Packets.html) — download the HTML and open it in a browser.
- Full inventory preview catalog — run the restoration command below, then open `catalogs/Cutout_Inventory.html` for the complete searchable inventory.
- [Character and set packets](registry/packets/) — source records, joints, variants, and review instructions.
- [Current production status](docs/STATUS.md) — inventory does not mean animation-ready.

GitHub displays HTML as source; download the catalog to use its controls. The catalogs are self-contained previews, not newly generated sheets.

## Restore the actual PNG files

Download this repository or clone it, then run:

```sh
python3 tools/restore_packets.py
```

This verifies and joins the three complete-packet ZIPs, then extracts the shared project into `production/Slopling_Cutout_Packets_v1`. Open `OPEN_PACKETS.html` there to browse the native assets.

For only Amy, Mark and the working Watson reference:

```sh
python3 tools/restore_packets.py --family
```

That opens the smaller `production/Family_Cutout_Packets_v1` project; use `OPEN_FAMILY_PACKETS.html`.

To reconstruct the downloadable ZIPs without extracting them:

```sh
python3 tools/restore_packets.py --assemble-only
```

The archives and two large support files (`catalogs/Cutout_Inventory.html` and `registry/CATALOG.json`) are stored as clearly labeled 8 MiB chunks so this repository does not depend on Git LFS. The script checks every chunk and the reconstructed ZIP against [the archive manifest](archives/MANIFEST.json). The recovered PNG bytes remain unchanged.

## What is indexed

| Item | Count |
|---|---:|
| Original cutout records | 2,542 |
| Historical scale PNG records, including assembled references | 2,342 |
| Working Watson front/profile cards | 30 |
| Total inventory records, including references | 5,227 |
| Cast bindings | 71 |
| Character, set, support and reference packets | 124 |
| Exact duplicate records linked | 725 |
| Unique included native files | 4,221 |

## Keep these separate

- **Original cutouts:** recovered source parts, variants, expression heads, props and sets.
- **Historical scale exports:** earlier resized exports; previous calibration claims do not prove they fit.
- **Working Watson reference:** a separate preserved reference, not the rejected parent rigs.
- **Rejected parent animation experiments:** listed as excluded; not imported as production art.

Amy and Mark remain **unapproved for animation** until their actual parts pass assembly and motion tests. Their next checks are [Amy](registry/packets/char_mother/NEXT_REVIEW.json) and [Mark](registry/packets/char_father/NEXT_REVIEW.json).

See [asset policy](docs/ASSET_POLICY.md), [source provenance](docs/SOURCE_ARCHIVES.md), and [integrity checks](registry/INTEGRITY_CHECK.json). This initial import does not assign a blanket license or configure Copilot/collaborators.
