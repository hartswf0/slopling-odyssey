# SCION orchestration: making the whole ASAPS engine visible

ASAPS is the score. Every beat, it decides what is true: who feels what, who sees whom, what you carry, what is now possible and what has closed. The SCION swarms are the orchestra's sections. Each one owns a single translation from an engine channel into something you see, hear or can do. Each has a test that measures it and a critic who watches the result.

A swarm that can't name its ASAPS channel and its test isn't doing orchestration. It's decoration.

## The channels, and who plays them

`player/world.js` reads the whole engine once per beat (`readWorld`). Every swarm works from that snapshot, so they all see the same state.

| ASAPS channel | On screen now | Owning swarm (lineage #) | Status |
|---|---|---|---|
| Beat, cluster, place | The set at its authored layout; the place in the top bar; the map with unvisited places dark | 50 Library of Congress / 54 Provenance graph | Built. Sets are native packet art. |
| Dialogue line and speaker | Kokoro voice. Text paged to fit and turned with the voice. The speaker's gesture and bob follow the line's loudness. | 47 Sound-to-Action | Built and measured: 147/147 lines voiced, A/V sync median +10 ms. |
| **Emotion** (`fireEmotion`: joy, pride, sadness, interest, shame, fear) and **mood** (valence, arousal) | The character's head is swapped for the matching packet expression, E01–E17, hung at its own neck anchor, with a card-flick sound. Crowds take faces from what they're doing (clapping is delight; shades are withdrawn). | 46 Face Landmark Registration + 38 Dynamic Pose Selection | Built. Nothing measures yet that a face matches its emotion; that needs a critic. |
| **Sentiment** (`addSentiment`: the father's *pride in the title* against *recognition of the work*) | Shown as two meters on the HUD ("Lars sees · the title / you"). At recognition ≥ 0.5 his face goes to E14, "warm: he sees you". | 48 State Machines | Built. |
| **Reflection** (`addReflection`, the father's private thoughts) | A thought bubble over him on the frame it's added; kept in the Journal | 47 + 13 Secondary motion (timing) | Built. |
| **Goals** (`setGoalStatus`: keep the craft, be seen, climb) | A toast when one is met or failed; Odie's sheet; the Journal | 48 | Built. |
| **Inventory** (`pickProp`, inventory conditions) | Click a prop on stage to see its sheet, including what it opens later. Take it and it flies into the inventory. It glows when a choice can use it, and tapping it makes that choice. | 43 Collage graph rewriting (object identity) | Built. Tested on the desk → orchard path. |
| **Conditions** (23 gated choices) | Locked choices are shown with the reason ("Needs the Prompt Journal: you didn't take it"). The chart keeps visited and locked islands. | 48 State Machines ("characters that can refuse") | Built. |
| Counters (Craft, Standing, Cunning, Meaning, Leverage) | HUD numbers and changes shown as toasts. Craft is also the line of light, Standing the paper tag. | 6 Whitney (state as phase in the score) | Built. The score only reads Standing and recognition so far. |
| Variant (`odie_lead`, `odie_bench`, `lars_orchard`) | On the character's sheet | 39 Multiview / 21 Photo-to-Actor | **Shown, not performed.** No costume or prop change yet. |
| Visited beats, random targets | Back replays the run under the same seed | 54 Provenance graph | Built. Nothing yet shows *which branches you didn't take*. |
| AI beats (conversation, summary) | ASAPS's own "requires configuration" notice | — | **Inert** without a provider. |

## One beat, end to end

1. **ASAPS executes the beat.** It applies effects, then calls the renderer: `renderText`, `renderDialog`, `renderChoices`, and so on.
2. **World snapshot** (`readWorld`): faces, moods, sentiments, reflections, goals, inventory, variables, visited beats.
3. **Staging swarm.** The set, cast, crowd and props for the place come on with their sounds: wire slide, flat drop, prop tap.
4. **Face swarm.** Every character on stage gets the head for their state; changed faces flick.
5. **Voice and gesture swarm.** The line plays; the speaker's body follows its loudness, and silence holds them still.
6. **Consequence swarm.** Choices appear, each with the asset it's about. The same object is badged on stage, locked choices show their reasons, and usable items glow.
7. **Insight swarm.** New reflections become thought bubbles, goal changes become toasts, and both go to the Journal.
8. **Score swarm.** The place theme plays, warmed by recognition; when the story says "you say nothing", it rests.
9. **Critic.** A recorded take (`tests/record-take.mjs`) goes to a reviewer who hasn't seen the builder's notes.

Each swarm's code has one entry point and one test:

| Swarm | Entry point | Test |
|---|---|---|
| Staging | `stage.setScene` | `tests/heads-lineup.html` (scale) |
| Faces | `world.faceFor`, `stage.faceRig` | None yet |
| Voice | `tools/render_voices.py`, `sound.say` | `tests/voices.mjs`, `tests/av_sync.py` |
| Consequence | `ui.card` (locked, usable) | Browser fuzz of all presets |
| Insight | `hud.update` | Browser check, desk → orchard |
| Score | `sound.schedule` | Idle drone measurement |

## What is still missing, in order of what it would add

1. **Turning.** The packets hold 54 profile assets, including left-profile heads for Odie and his father, but the rigs only face front. The Casting Lab's "Turn" row is still blocked. *Lineage 39, Multiview substitution.* Proof scene: the father turning away ("He doesn't ask about the work").
2. **Items in hand.** Showing the calipers should put them in Odie's grip hand. The packets have `hand_*_grip` cards that go unused. *Lineages 33 (IK) and 43.* Proof: "Show him the calipers you still carry".
3. **Variants performed.** `odie_lead` should change something you can see (lanyard, posture, the tag), not just a line on the sheet. *Lineage 21.*
4. **The branches you didn't take.** A story-graph view of chosen, closed and unreached paths, from ASAPS's visited beats and conditions. *Lineage 54.*
5. **Faces checked by a critic.** A frame grid of each fired emotion beside the face shown, judged blind. *Lineage 46, with a critic.*
6. **Voices that carry emotion.** Kokoro takes speed only. Render a second take for strongly emotional lines (slower when sad), or try an expressive TTS. *Lineage 47.*
7. **Mouths.** There's no viseme set, only bob and gesture. Hold a closed-mouth face in silence and an open one on loud frames? Only worth it if a critic prefers it.
8. **The mother.** Her packet has 36 expressions, but she has no role in this story.
9. **The AI beats.** They need a provider. Without one, they should become authored lines rather than a notice.

## Running a swarm

Use one session per swarm, never one session for everything. Give it:
- the lineage prompt from `SCION_Swarm_Operator.html`;
- **[WORK]**: the proof scene above;
- **[RESOURCES]**: this repository, with `world.js` as the contract (read the snapshot, never the engine directly);
- **[DELIVERY]**: a take from `tests/record-take.mjs`, plus the swarm's test.

The critic gets the take and the expected experience, not the builder's notes. A swarm's change is accepted when:
- its own test passes;
- the browser fuzz still finishes every preset;
- the conformance and voice tests still pass;
- the critic's acceptance condition is met.
