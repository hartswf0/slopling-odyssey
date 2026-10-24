# Sound

Half of what sells a cardboard cutout is what you hear when it moves. The player's sound is therefore built from the animation, not laid over it. Every effect is triggered by an event the stage emits on the frame it draws the motion.

| Layer | Source | Where |
|---|---|---|
| **Voices** | Kokoro-82M v1.0 (Apache-2.0), pre-rendered offline. One voice per role; Odie's own choices stay unvoiced, because the player speaks them. | `tools/render_voices.py` → `player/voices/` |
| **Effects** | Synthesized in Web Audio from stage events (below). | `player/sound.js` |
| **Ambience** | Moving beds only (waves, wind) plus sparse room events (keyboards, a far-off press, birds, the train). There are no standing tones: an idle 45 s in the office went from one band sounding through every frame to none above 41% of frames, and near-silence 71% of the time. | `sound.js` `bed()` |
| **Score** | A small procedural score in the same file: eight bars of music, then eight bars of rest. | `sound.js` `THEMES` |

The score's themes:
- **The ladder:** pizzicato and a rising music-box arpeggio.
- **The sea:** a plucked lyre in D dorian.
- **The father:** a low pad and a falling fourth. The harmony warms when he sees his son, and resolves when his hand reaches the shoulder.
- **The Underworld:** a drone and silence.
- **The Hendry memory:** music box and crackle.

## Effects come from the stage

| The stage does | You hear | Emitted |
|---|---|---|
| A card slides in on its wire / leaves | Paper whoosh panned to its side, a wire squeak | `enter`, `leave` |
| The set changes | A flat dropping onto the boards | `flat` |
| Watson changes pose | Brad clicks, one per ~22° of joint travel; a card creak on big moves | `pose` |
| The father crosses slowly | Footsteps, one per 46 px walked, heavier for him | `step` |
| A clapping chorus member's hands meet | A clap, panned to that member | `clap` |
| The Oracle's circle raises its arms | A vowel chant | `chant` |
| The tag's string is cut | Snip, snip, string twang, then paper flutter while it falls, a tap when it lands | `snip`, `flutter`, `tagLand` |
| The hand rests on the shoulder | A cloth pat and the father's cadence | `touch` |
| Tree names / the invisible work are hung | A paper flick and wood knock / a paper tick and a music-box note | `tagDrop`, `workTag` |
| A prop lands, or a lifted prop glows | A card tap pitched by size / a bell | `prop`, `lift` |
| Craft (the line of light) | A faint glassy hum at the strength the light is drawn | `setLight` |
| "So you stop. You say nothing." | The score stops; only the room is left | `still` |

**Voice drives gesture.** A speaking figure's bob and arm gesture follow the loudness envelope of its line (stored per line in `voices/manifest.json`). In a pause, the figure rests instead of flapping. Without a voice file, the figure falls back to the old gesture loop.

**Mix.** Voice ducks the score about 10 dB and the room about 5 dB. There are separate switches for Voices, Music and Effects, plus a volume control; they are remembered per browser. The sound engine has its own random source, because `Math.random` is seeded during rehearsals and the conformance tests depend on it.

## Evidence

**Measured**
- `node player/tests/voices.mjs`: all 147 distinct lines real ASAPS speaks across rehearsal seeds 1–200 have a rendered file in the right voice (161 files, 45 minutes, 14 MB). One exception is deliberate and left unvoiced: ASAPS's own "AI features require configuration" notice. Questions written as narration that quotes someone (`showSpeaker: false`) are read by the narrator.
- `python3 player/tests/av_sync.py take.webm`: on an effects-only take of the Call (`SFX_ONLY=1`, 90 s, 76 sharp events with a clear onset), audio follows picture by a median of +10 ms (10th–90th percentile 0 to +25 ms), and 92% fall within ±45 ms. With voices and music playing, the onset detector also catches speech, so that number isn't meaningful.
- `node player/tests/conformance.mjs`: the sound engine leaves the seeded rehearsals unchanged.

**Not measured or judged yet**
- Nobody has listened to the mix. Agents can't hear, so the listening pass, and any verdict on acting, comedy timing or music, has to come from a person.
- Speech intelligibility wasn't machine-checked: speech-recognition models couldn't be downloaded in the build environment.

**Record a take** (picture and sound in one stream, with subtitles):

```sh
cd player && python3 -m http.server 8765 &
node tests/record-take.mjs ithaca 150 take.webm
python3 tests/av_sync.py take.webm
```

## Using the SCION swarm operator

`SCION_Swarm_Operator.html` holds 54 lineage prompts. Each is a standalone brief: a creative theorem, a hard proof scene, an independent critic, and honest evidence. This film should use them as role briefs for specific passes, each run on a passage of this film:

| Lineage | Pass on this film | Proof scene here | Already measured | Still needs |
|---|---|---|---|---|
| 47 Sound-to-Action | Voices, gesture from sound, silence | Orchard, beat 93 on: the father speaks, a pause, the tag is cut, Odie says nothing | Voice coverage, A/V sync (measured); gesture rests at zero loudness (by construction, not measured) | A human listener; mouth shapes (the cards have no viseme set) |
| 1 Terry Gilliam | Impact sound and held frames | The cut tag: snip, flutter, land, hold | Events fire on the drawn frame | A held frame after the landing; a gag critic |
| 6 John Whitney | Score as phase | The clapping office chorus | Clap timing comes from each member's phase | Lock the office theme's tempo to the clap rate (9 rad/s, about 86 bpm), so the chorus and score phase in and out |
| 16 JibJab | Recastable performance | Casting Lab (`player/lab.html`) | 78/78 invariants | Watson adapter |
| 39 Multiview substitution | Turns | Casting Lab "Turn" row | Blocked: front cards only | A profile card bank |

To run one, open a fresh session on this repository. Use the lineage's prompt from the operator page with:
- **[WORK]:** the proof scene above;
- **[RESOURCES]:** this repository;
- **[DELIVERY]:** a recorded take from `tests/record-take.mjs`.

Give the critic the take and the expected experience, never the builder's notes.
