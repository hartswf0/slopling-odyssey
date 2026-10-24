# The surface: a lit theatre, not a website

## Creative thesis

You are not using an app about a story. You are sitting in front of a cardboard theatre whose prompter has the book open and is watching what you choose. The story is about work that leaves no mark. The surface should do the same: leave no mark of its own, and let the cut-outs, the voices and the light carry it.

- **Defining passage.** The orchard. The father's hand reaches the shoulder, the camera closes in, the tag is cut. Everything else prepares for that touch, so nothing else gets that much camera, light or music.
- **What would make it forgettable.** A web page with a story in it: a title bar, panels, badges, menus, and emoji standing in for meaning.

## References (what each one is for)

| Reference | What we take from it |
|---|---|
| Pollock's toy theatre, and Lotte Reiniger's *Prince Achmed* | Cut-outs on a lit stage in a dark room, where the frame is the world |
| *Kentucky Route Zero* | Theatrical staging, and text that sits in the scene rather than in a UI |
| *80 Days* (inkle) | Choices short and in the fiction; a map you navigate rather than read |
| *The Stanley Parable*, *Disco Elysium* | A voice that comments on what you do, breaks the fourth wall, and is funny without stopping play |

## Keep or cut

| Element | Now | Why |
|---|---|---|
| Title bar, place name | **Cut.** A chapter slate fades in when the scene changes, then goes. | Where you are matters at the change, not all the time. |
| Dialogue panel | **Cut.** Subtitles sit over the stage on a soft band, inside the frame on every screen. | Words belong to the picture. |
| Choice buttons | **Now cards set on the stage**, each with the thing it is about. | Diegetic, and tactile. |
| Emoji (lock, tick, arrows), the menu glyph | **Cut.** A drawn keyhole, words, typographic numerals. | |
| Always-on HUD (stats, father meters) | **Cut.** A slip appears when something changes; tap Odie or Lars for the rest. | Show changed conditions, not standing state. |
| Inventory bar | **Now a pocket.** It shows itself when something arrives or a choice can use it, and is faint otherwise. | |
| Controls (Back, Journal, Map, Menu) | **Four words**, faint until you reach for them, absent before the journey starts. Back only exists while there is a choice to go back to. | |
| Locked choices | **Dark cards you can try**, showing only the keyhole and the line. Touch one: the lock rattles and the prompter tells you why. If the key was dropped somewhere you can return to, the card offers to take you there, and once you land the thing you missed is ringed on stage. | Constrained play, and recovery. |

## States

| State | What you see |
|---|---|
| **Rest** | The orchard lit, the title in the sky, one word: Begin. |
| **Reading** | Subtitles paged to fit, turning with the voice; a small mark to read on. |
| **Choosing** | Cards, plus the matching things badged on stage; the pocket glows if an item is usable. |
| **Changed** | Slips (Craft +1, Taken: Brass Calipers); thought bubbles over the people who have them. |
| **Locked, then offer** | First touch: rattle and the prompter's note. Second touch: back to the moment, and everything after is undone. |
| **Recovery** | Back, or a lock's offer, replays the run under the same seed to an earlier choice. |
| **Complete** | The ending, then "Sail again". The prompter has the last word. |

## The prompter (`player/asides.json`, `player/prompter.js`)

- **Lines.** 22 lines, voiced by Kokoro (`bf_emma`). One for each kind of lock (item, past choice, counter, visited), for poking the scenery or a person too often, for idling on a choice, for going back three times, for the start and the end.
- **Manners.**
  - He speaks over a ducked scene; he never cuts a line or blocks play.
  - He makes at most one unprompted remark per 20 seconds. A lock always earns an answer.
  - In landscape his note is pinned at the stage's edge; in portrait it takes the reading area.

## Evidence

**Measured**
- No page scroll and no card off-screen: desktop, portrait phone, landscape phone.
- No emoji anywhere in the interface.
- Lock, offer and rewind measured on desktop, upright phone and landscape phone. The rewind lands on the line before the desk.
- The lock, the offer and the rewind work in the real UI. On the ladder route, the journal card answers; touching again rewinds to just before the desk.

**Judged** (independent critics with fresh context, from stills only; none saw motion or heard sound)
1. **Round 1: reference stronger.** Words and choices lived in a separate layer: a tray on desktop, a page under the picture on phones. Other faults:
   - a native web dropdown on the opening;
   - lock reasons printed on the cards, spoiling the prompter's line;
   - a floating paper flag (stray grafting tape);
   - stray light streaks.

   Repaired:
   - words and cards moved inside the stage frame;
   - a playbill replaced the dropdown;
   - the reasons moved to the prompter;
   - the tape and the streaks were removed;
   - after a rewind, the prompter speaks and the missed item is ringed.
2. **Round 2: reference stronger.** On an upright phone the stage was a strip above an apron that still read as a panel, and the Begin button covered Odie's face. Other faults:
   - glossy buttons;
   - a yellow focus ring on the lock offer;
   - pager dots and numerals that read as web controls.

   Repaired:
   - on tall screens the scene now fills the frame and the camera holds on one person, as vertical film does;
   - Begin and Continue are tickets;
   - the offer is a lit edge and a handwritten line;
   - the dots and numerals are gone;
   - the controls live on the stage.
3. **Round 3: reference stronger.** The upright phone was the weak frame. Faults:
   - the camera held one face, so the scene read as a portrait rather than a stage;
   - the top of the frame was an empty wash;
   - the cards read as a list;
   - the prompter's note landed on the actors' heads.

   Repaired:
   - tall frames use a two-shot (Odie and whoever speaks, plus up to two of the cast);
   - a proscenium valance closes the top, and the set extends above and below;
   - the cards are fanned and set in serif, and they no longer carry a thumbnail of the person you can see on stage;
   - the prompter takes the subtitle's place while he speaks;
   - a lock's offer replaces its own line, so the cards don't jump.

**Acceptance on an upright phone (iPhone 13, measured)**

| | Both faces in frame | Empty top | Cards' share of height | Note over a face |
|---|---|---|---|---|
| Choosing | yes | 10% | 28% | no |
| After touching a lock | yes | 10% | 26% | no |

**Routes (fuzzer, all six starting points)**
- 12 random runs, all reaching an ending: Argos, Ajax's Silence and Laertes's Orchard each reached at least once.
- No page errors.

**Unknown**
- Motion, sound and timing in play. Nobody has played it on a phone yet.
