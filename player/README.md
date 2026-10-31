# Slopling's Odyssey player

The ASAPS story, playable on a cardboard toy-theatre stage. The **real ASAPS engine** (built from ASAPS Modern `packages/core`) runs the 97-beat story graph: choices, conditions, counters, the father's moods and sentiments, and the four endings. A cardboard renderer performs each beat with this repository's own cutouts, sets and story props.

## Play it

```sh
cd player
python3 -m http.server 8000      # any static server; the page fetches JSON, so file:// won't work
# open http://localhost:8000
```

Press **Play**. "Start from" lets you rehearse to a later point. ASAPS plays the earlier beats with a fixed, seeded set of choices, then hands control to you:

- the beginning;
- the Call;
- the Voyage hub;
- the Underworld;
- Ithaca carrying the calipers;
- Ithaca after taking the chair.

**How it plays.** A lit toy theatre in a dark room. The stage is the screen; on a phone held upright the scene fills it, and the camera holds on whoever matters.
- Words arrive as subtitles inside the picture, paged to fit and turned by the voice. Tap to read on.
- Choices are cardboard cards set on the stage, each showing the place, person or thing it's about, which is also ringed on stage.
- **Locked choices are dark cards with a keyhole.** Try one and the theatre's **prompter** answers from the prompt box. If the key was dropped somewhere you can go back to, the card offers to take you there, and the thing you missed is lit when you land.
- Touch anyone or anything on stage for their sheet: face and mood, feelings, feelings toward you, private thoughts, and the choice about them. Things also say what taking them opens later.
- What you carry sits in a pocket that shows itself when it matters. Changes arrive as paper slips. Thoughts appear over the people who have them and go in the **Journal**.
- **Back**, **Journal**, **Map** and **Menu** are faint words on the stage. Island choices open as a chart that keeps visited and locked islands. Keys: Space or Enter read on, 1–9 choose, M map, J journal, Esc close.
- The design and its critiques are in `docs/SURFACE.md`; the engine-to-screen mapping is in `docs/SCION_ORCHESTRATION.md`.

The voices, effects and score can each be switched off from the menu (☰); see [`docs/SOUND.md`](../docs/SOUND.md).

The side panel shows live ASAPS state: Craft, Standing, Cunning, Meaning, Leverage, and how much the father sees the title versus the son.

Everything the player needs is in `player/`. You don't need to restore the archives to play it.

## How it fits together

| Piece | What it is |
|---|---|
| `vendor/asaps/asaps-core.slopling.js` | ASAPS core 2.0.0 (ASAPS Modern v0.9.133, commit `40aa002`), bundled with esbuild from `slopling-entry.ts`. That entry exports `StoryEngine` and loads a Story Generator file the way ASAPS's own `PlayerEngine.createStoryFromJson` does. PolyForm Noncommercial: see `vendor/asaps/LICENSE.md`. |
| `ui.js` | The surface: paging, choices with asset thumbnails, stage badges and clicks, the chart and the journey map, Back. |
| `player.js` | `CardboardRenderer` implements ASAPS's `IRenderer`. ASAPS calls `renderText`, `renderDialog`, `renderChoices`, `renderPropSelection` and so on; the renderer stages the beat and returns the player's choice. Lines that name a physical event trigger stage cues (naming the trees, the hand on the shoulder, the cut tag). |
| `stage.js` | Canvas stage. Watson is the working 15-card front rig from `Watson_Working_Reference.zip`. Everyone else is assembled from their scale-matched cards at the recorded anchors (`anchor-rig.js`), with leg and arm cards lengthened so they stand as adults. Craft is drawn as a line of light; Standing as a paper tag. |
| `staging.json`, `assets/` | Built by `tools/build_player_assets.py` from the scene dependencies and packet crosswalk, with authored cast fixes. Native PNG bytes are copied unchanged; `assets/SELECTION.json` records each one's packet, source member and hash. |
| `layouts.json` | Set layouts for 22 places, authored with `tools/preview_set_layout.py`. The orchard layout lives in `stage.js`. |
| `sound.js`, `voices/` | Sound. Kokoro voices are pre-rendered for every line and looked up by a hash of the text ASAPS renders. Effects are synthesized from the stage's own animation events, with ambience and a small procedural score on top. The details are in `docs/SOUND.md`. |
| `props/`, `props.json` | Story props (calipers, offer letter states, clementines, prompt journal, bow, lathe, phone, hourglasses, moly, IBM 360, Knuthe's ladder). No native PNG exists for these, so `tools/extract_kit_props.py` cuts them from the JPEG kit crops and records each source and crop box in `props/PROPS.json`. |

## Who and what is on stage

| | |
|---|---|
| **Cast** | 64 rigged figures drawn from the packets. |
| **Speakers** | Stand in the slots and gesture while they speak. |
| **Crowds** | A back row, slightly smaller for depth: the office chorus clapping, the HR pair, the VP and a client, the Oracle's researcher circle chanting, Vane colleagues, hidden engineers, the Underworld's reorg shades (grey and translucent), Circe's offsite leads, Ajax's forge apprentices, and the orchard neighbours. |
| **Thinkers** | Ryle and Naur ("Knowing How"), Graeber (the offer letter), James C. Scott (the Cyclops), and Lave and Wenger (the Road), each with a name plaque. Mau Piailug and a navigation learner stand still by the canoe. |
| **Sets** | 26 laid out. The Road (beat 47) is a panorama through Compagnons, pottery, Ise and ijazah. Beat 8 is the Hendry works as a sepia memory. |
| **Props** | Native props from the packets take precedence: the journal (closed, open, reading hands), calipers, offer letter, grafting knife and scion, rag, the father's shoulder-contact hand, Ajax's shield, the oat flat white, unicycle, maze, juggling ball, moly, canoe and paddle, potter's wheel, Ise tools. JPEG kit cuts are used only where nothing native exists: the letter's later states, clementines, bow, hourglasses, lathe, sprint board. |

## Watching, sending and coming back

- **Just watch.** The prompter plays the show. He reads each page to the end of its voice (or at reading pace with the sound off), holds on the choices and lights the card he takes. He prefers roads this browser has never taken, so watching again shows something new. He sometimes says why. Touch anything, or press a key, and the controls are yours.
- **Send this odyssey.** Every ending offers a link (`#w1.<seed>.<one character per choice>`). Whoever opens it watches the same show: same seed, same choices, the same beats in the same order. They can take over at any point.
- **Memory** (`memory.js`, localStorage). The browser keeps the endings found, the roads taken and how the last show ended.
  - **The start screen** lists the four endings: found ones by name, the rest by a teasing line.
  - **The prompter** greets a returning player by how the last show ended.
  - **Each ending** says how many of the four you've found, and the prompter teases one you haven't.
  - **Private windows** and blocked storage simply forget; nothing else changes.

## The shot list (`shots.json`)

Camera direction is data, decided per beat, as previs tools do it.
- **Tall screens.** An upright phone sees the whole stage, edge to edge, under a deeper curtain; only the touch and shots authored `single` or `close` move in. A one-time hint says sideways is bigger.
- **Sizes.** Each entry names a size (`wide`, `group`, `two`, `single` or `close`), who the shot holds (`on`; `speaker` means whoever is talking) and a director's note (`why`).
- **Cuts.** An authored shot cuts in. `"cut": false` drifts in instead.
- **Unlisted beats.** These keep the automatic camera, which holds Odie and whoever speaks.

`tests/shots-qa.mjs` renders every beat on an upright phone or on desktop. It checks that the faces the shot holds sit clear of the valance, the subtitles and the cards, and writes a contact sheet. `docs/shots/before-after-phone.png` compares the automatic camera with the shot list on the directed beats.

## Casting Lab (`lab.html`)

The first proof for a recastable puppet-film studio. A performance is data that belongs to no actor: joint channels, foot contacts, an IK hand target and a prop. One performance plays on three cast slots at once, and any slot can be recast to any of the 64 rigs.

Every invariant is measured on 120 frames per performance, on the visible art (each card's opaque hull), not on the padded cards:

- the head stays on the neck;
- elbow and wrist stay joined;
- nothing sinks below the floor;
- a planted foot doesn't slide;
- a fall lands on the floor;
- the hand stays on the prop while holding it;
- the figure ends where it started;
- the performance hash is the same on every actor.

Click a cell to jump to its worst frame. Untick "Plant feet" to see what the contact solve is fixing.

- **Measured:** walk (front, in place), reach–grasp–lift–release, fall and recover, and speak pass 78 of 78 checks on Dana, Chad and Ines.
- **Caught by looking, not by the numbers:** the first fall floated above the floor, because the check measured the padded cards. The check now uses opaque hulls, and the downside arm tucks in so the body takes the floor.
- **Blocked:** a front-to-profile turn. The packets hold front cards only.
- **Not yet in the lab:** Watson, who uses a different rig.

## Rebuild

```sh
python3 tools/restore_packets.py          # restores production/ (about 1 GB, git-ignored)
python3 tools/build_player_assets.py      # staging.json + assets/
python3 tools/extract_kit_props.py        # props/
node player/tests/conformance.mjs         # ASAPS conformance (below)
.kvenv/bin/python tools/render_voices.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin   # voices (setup in the script header)
node player/tests/voices.mjs              # every spoken line has its voice
node player/tests/fuzz-ui.mjs start 3 1     # random playthroughs of the real UI reach an ending (server on :8765)
```

To rebuild the ASAPS bundle, clone ASAPS Modern, `npm install --workspace @asaps/core`, then
`esbuild packages/core/slopling-entry.ts --bundle --format=esm --platform=browser --outfile=asaps-core.slopling.js` with the entry file from `vendor/asaps/`.

## Validation

**Measured**
- `node player/tests/conformance.mjs`: across rehearsal seeds 1–60, real ASAPS reaches all four endings and no route loops. The counts were Argos 27, Telemachus 25, Ajax's Silence 5, Laertes's Orchard 3.
- The two Ithaca rehearsal presets hand over in recorded states, and the browser matched Node exactly. A sound effect that drew on the seeded `Math.random` had broken this; it now uses its own random source.
- Watch mode, played to an ending at test speed on an upright phone. Its sent link, opened in a fresh browser, replayed the identical 70 beats and choices to the same ending. Touching the stage while he plays hands control back, and the show waits.
- `node player/tests/shots-qa.mjs phone|desk`: all 97 beats pass on both, with the shot list. The first pass found Ines standing half off the stage edge in the homecoming office scenes (77–89), on every screen. Cast beyond a set's marks had been stacked past the last mark; they are now spread over the open floor.
- With no AI provider, ASAPS's AI conversation beat shows its own "requires configuration" line and the story continues.

**Judged** (independent critics with fresh context, from still frames; no reviewer watched motion or heard sound)
1. **First critic, orchard passage: reference stronger.** The gesture was told, not performed. Single cards couldn't reach.
2. **Inquiry:** I rebuilt the father from his cards at the recorded anchors. At rest it matches his assembled reference (`tests/anchor-rig-test.html`), so his arm can rise.
3. **Second critic: acceptance condition met, narrowly.** The hand rests on the shoulder, faces are clear, and the tag lies cut on the floor. Its refinements are applied: the hand sits higher, the light dims at contact, and the page fits at 1400×900.
4. **User review: the cast looked squat, and the story props were missing.** Since then, the cast is lengthened at the anchors (`tests/proportion-test.html`) and props come from the kit crops. Neither change has had an independent review yet.

## On GitHub Pages

`.github/workflows/pages.yml` publishes the root page, `player/`, `story/` and `catalogs/` on every push to `main`. The cutout archives are left out: with them the site is about 1.2 GB, over GitHub Pages' 1 GB limit. One-time setup: Settings → Pages → Source: **GitHub Actions**. The site is then at `https://hartswf0.github.io/slopling-odyssey/`, and the player is at `/player/`.

## Known limits

- **Proportions.** Lengthening the limb cards stretches the knee brads into ovals. That's a compromise with the native art, not new art.
- **Who appears where.** Cast and set bindings come from the semantic crosswalk plus authored fixes. Beats a critic hasn't seen may still put the wrong person on stage.
- **Text versus art.** The father is described in an "old jacket" but his art wears short sleeves.
- **Coverage.** Mau Piailug's passage uses only the sea set; no figure.
- **Unrestored assets.** `production/` stays git-ignored. Only the selected files are copied into `player/assets/`.
