// Conformance check: the vendored ASAPS engine plays the story to every ending, and
// the rehearsal presets hand over in the recorded state. Run: node player/tests/conformance.mjs
import { play } from './routes.mjs';
import assert from 'node:assert/strict';

const ENDINGS = ["Laertes's Orchard", 'Telemachus', 'Argos', "Ajax's Silence"];
const seen = new Map();
for (let seed = 1; seed <= 60; seed++) {
  const r = await play(seed);
  assert.ok(!r.looped, `seed ${seed} looped`);
  assert.ok(r.end && !r.end.startsWith('ERROR'), `seed ${seed} did not end: ${r.end}`);
  seen.set(r.end, (seen.get(r.end) || 0) + 1);
}
for (const e of ENDINGS) assert.ok(seen.has(e), `ending never reached: ${e}`);
console.log('endings over seeds 1-60:', Object.fromEntries(seen));

// Rehearsal presets in player.js ("ithaca", "ithaca_ladder") must hand over in these states;
// the browser was checked against the same values.
const HANDOVER = {
  37: { counters: { craft: 9, standing: 1, cunning: 4, meaning: 6, leverage: 4 }, callChoice: 'decline', roleHolder: 'nobody', knowsFatherCraft: true, recognition: 0.3, pride: 0.1 },
  2: { counters: { craft: 3, standing: 9, cunning: 6, meaning: 4, leverage: 3 }, callChoice: 'accept', roleHolder: 'you', knowsFatherCraft: false, recognition: 0.2, pride: 0.5 },
};
for (const [seed, want] of Object.entries(HANDOVER)) {
  const r = await play(+seed, { until: 'beat_93' });
  assert.deepEqual(r.state, want, `handover state for seed ${seed}`);
}
console.log('rehearsal handover states: ok');
