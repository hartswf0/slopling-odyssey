// What this browser remembers between visits: the endings found, the roads taken, how many times the
// curtain has gone up and how the last show ended. It lives in localStorage; when the browser keeps
// nothing (a private window, blocked storage) the show still plays, it just forgets you.
const KEY = 'slopling.memory.v1';

// The four endings, in the order the playbill lists them, each with the line the prompter teases it by
export const ENDINGS = [
  { title: "Laertes's Orchard", tease: 'One where your father learns the names of the trees.' },
  { title: 'Telemachus', tease: 'One with a hug in it, and no word for what you do.' },
  { title: 'Argos', tease: 'One where only the work remembers you.' },
  { title: "Ajax's Silence", tease: 'One where you say nothing at all.' },
];

export function makeMemory() {
  const blank = () => ({ visits: 0, shows: 0, endings: {}, taken: [], places: [], last: null });
  let m = blank();
  try { m = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch {} };
  const taken = new Set(m.taken), places = new Set(m.places);
  m.visits++; save();
  return {
    get: () => m,
    found: () => ENDINGS.filter(e => m.endings[e.title]),
    unseen: () => ENDINGS.filter(e => !m.endings[e.title]),
    hasTaken: (beat, id) => taken.has(beat + '|' + id),
    began() { m.shows++; save(); },
    took(beat, id) { const k = beat + '|' + id; if (!taken.has(k)) { taken.add(k); m.taken = [...taken]; save(); } },
    passed(place) { if (place && !places.has(place)) { places.add(place); m.places = [...places]; save(); } },
    ended(title) { const e = m.endings[title] ||= { count: 0 }; e.count++; e.at = Date.now(); m.last = { ending: title, at: Date.now() }; save(); },
    // what the prompter says when the curtain goes up: a first visit, a return after a given ending, or a completist
    greeting() {
      if (!m.last) return m.shows > 1 ? 'return' : 'hello';
      return this.unseen().length ? 'return:' + m.last.ending : 'return:all';
    },
  };
}
