# The Slopling's Odyssey (Odyssey V3.0)
**Complete 186-Card Cut-Out Ensemble Atlas · 97-Node Cineosis Lab & Moving Image Archive Shot Catalog · Real/Mythic Reference Bible**

---

## Live Viewers (GitHub Pages Ready)
- **[`index.html`](./index.html)** / **[`odyssey_storybeat_kits_cards.html`](./odyssey_storybeat_kits_cards.html)** — **Unified Odyssey V3.0 Master Application** (self-contained with embedded master sheets, family portraits, 186 cards, 97-node Ensemble & Set Switcher, Dual Real/Mythic Stage, simulated Cineosis & WarGames CRT Archival Monitors, and Full Reference Bible).
- **[`viewer/cards.html`](./viewer/cards.html)** — **High-Resolution Cut-Out Atlas Viewer** (linked to local `./images/odyssey_kit_sheets/` & `./images/kit_crops/`).
- **[`the_sloplings_odyssey_reference_package.html`](./the_sloplings_odyssey_reference_package.html)** — **Standalone Real & Mythic Reference Bible Viewer** (Ink & Brass archival edition).

---

## Core Documentation & Catalogs
- **[`SHOT_LIST.md`](./SHOT_LIST.md)** (`the_sloplings_odyssey_shot_list.md`) — Complete **97-Node Shot List, Archival Film Citation Matrix & Dual-Camera Production Script**, integrating:
  - **[Cineosis Lab](https://hartswf0.github.io/cineosis-lab/)** — 5-Axis Semiotic Vector (`[Sign, Mode, Time, Space, Syntagm]`)
  - **[The Found Odyssey Museum](https://hartswf0.github.io/cineosis-lab/lab/found-odyssey-museum.html)** — 24 Books (`OD-B01` to `OD-B24`), 5 Desk Props (`[P1]`–`[P5]`), and 8 Interactive Epilogue Branches (`ep_inland`–`ep_lotus`)
  - **[WarGames Studio Set](https://hartswf0.github.io/cineosis-lab/lab/wargames-studio.html)** — 7 Executable Subsystems (`WOPR` Launch Codes, `DEFCON` HUD, Dual-Key Switch, Hexad Lattice, and Acoustic Coupler)
  - **[Periodic Table of Cinematic Signs](https://hartswf0.github.io/cineosis-lab/periodic-table.html)** — 60-Sign Taxonomy (`IC-01` through `SY-20`)
  - **[Moving Image Archive](https://www.movingimagearchive.com/)** — Prelinger, US National Archives, NASA, Periscope, and Bell Labs 16mm/35mm Public Domain Stock
- **[`ODYSSEY_V3_COMPLETE_ENSEMBLE_ATLAS.md`](./ODYSSEY_V3_COMPLETE_ENSEMBLE_ATLAS.md)** — Complete 186-Card (`89 Modular Kits` + `97 Storybeat Kits`) & 947 Cut-Out Piece Inventory.
- **[`README_REFERENCE_BIBLE.md`](./README_REFERENCE_BIBLE.md)** — Real vs. Mythic Cast, Locations, Props, and Concept Plates Documentation.

---

## Repository Directory Structure
```text
slopling-odyssey/
├── index.html                                    # Unified V3.0 Master Application (GitHub Pages root)
├── odyssey_storybeat_kits_cards.html             # Unified V3.0 Master Application
├── the_sloplings_odyssey_reference_package.html  # Standalone Reference Bible HTML
├── SHOT_LIST.md                                  # 97-Node Cineosis Lab & Moving Image Archive Shot Catalog
├── ODYSSEY_V3_COMPLETE_ENSEMBLE_ATLAS.md         # 186-Card & 947-Piece Ensemble Atlas Markdown
├── README_REFERENCE_BIBLE.md                     # Reference Bible Guide
├── push_to_github.sh                             # One-command push helper script
├── viewer/
│   ├── cards.html                                # High-Res Cut-Out Atlas Viewer
│   └── the_sloplings_odyssey_reference_package.html
├── data/
│   ├── odyssey_v3_complete_cineosis_atlas.json   # Full 186-card + 97 Cineosis/Archive JSON dataset
│   ├── odyssey_v3_complete_atlas.json            # Base 186-card + 947-piece JSON dataset
│   ├── ref_bible_full.json                       # Full Real/Mythic Reference Bible JSON dataset
│   └── asset_manifest.json                       # Image & Story Asset Manifest
├── story_data/
│   ├── odyssey-tragic-comedy.json                # 97-Beat Story Graph JSON (beat_0 to beat_107)
│   └── ideator-session.md                        # Original Ideator Session Transcript
└── images/
    ├── odyssey_kit_sheets/                       # 20 Master Cut-Out Sheets (S01_HEADS to S20_ITHACA_SWITCHBOARD, 1408x768)
    ├── kit_crops/                                # 89 Individual Kit Crops (K001 to K089)
    ├── family_and_protagonist/                   # 6 Family Reference Portraits (Watson, Mark, Amy Hartsoe)
    └── concept_plates/                           # 3 Production Concept Plates (Scylla, Sirens, Cyclops)
```

---

## Pushing to GitHub
This package comes with a pre-initialized `.git` repository committed on branch `main` with remote `origin` set to `https://github.com/hartswf0/slopling-odyssey.git`.

To push directly from your machine:
```bash
unzip slopling-odyssey-github-repo.zip -d slopling-odyssey
cd slopling-odyssey
./push_to_github.sh
```
