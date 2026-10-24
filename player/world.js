// What the ASAPS engine knows, read once per beat, in the shape the surface needs: faces from
// emotion and mood, feelings toward Odie, private reflections, goals, inventory, and plain-language
// reasons for the conditions that open or close a choice.

// The packets' expression heads share one code set (E01-E17) across every character.
export const FACE_LABEL = { E01: 'absorbed', E02: 'curious', E03: 'sceptical', E04: 'doubting himself', E05: 'politely strained', E06: 'delighted', E07: 'proud of the craft', E08: 'startled', E09: 'frustrated', E10: 'ashamed', E11: 'sad', E12: 'exhausted', E13: 'compassionate', E14: 'warm: he sees you', E15: 'relieved', E16: 'resolved', E17: 'withdrawn' };
const EMOTION_FACE = { joy: 'E06', pride: 'E07', sadness: 'E11', interest: 'E02', shame: 'E10', fear: 'E08', anger: 'E09', surprise: 'E08', trust: 'E14', disgust: 'E03' };

export function faceFor(id, mood, emotions, sentiments) {
  const top = Object.entries(emotions || {}).sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 0.12 && EMOTION_FACE[top[0]]) return EMOTION_FACE[top[0]];
  if (id === 'char_father' && (sentiments || []).some(s => s.emotion === 'recognition' && s.strength >= 0.5)) return 'E14';
  const v = mood?.valence || 0, a = mood?.arousal || 0;
  if (v > 0.35) return a > 0.35 ? 'E06' : 'E15';
  if (v < -0.35) return a > 0.3 ? 'E09' : 'E11';
  if (v < -0.12) return a < 0 ? 'E12' : 'E04';
  return null; // the card's own head: at rest
}
export function moodWords(m) {
  const v = m?.valence || 0, a = m?.arousal || 0;
  const vw = v > 0.35 ? 'bright' : v > 0.12 ? 'easy' : v < -0.35 ? 'low' : v < -0.12 ? 'uneasy' : 'steady';
  return a > 0.35 ? `${vw}, stirred` : a < -0.2 ? `${vw}, quiet` : vw;
}

export const COUNTERS = { craft: 'Craft', standing: 'Standing', cunning: 'Cunning', meaning: 'Meaning', leverage: 'Leverage' };
export const VARIANT_LABEL = { odie_lead: 'Team lead', odie_bench: 'Back at the bench', lars_orchard: 'In his orchard' };
// inventory item → the native prop card that shows it
export const ITEM_PROP = { 'Prompt Journal': 'journal_native', 'Brass Calipers': 'calipers_native', 'Offer Letter': 'offer_native' };
export const propItem = key => Object.keys(ITEM_PROP).find(n => ITEM_PROP[n].split('_')[0] === String(key).split('_')[0]);

export function readWorld(ctx, story) {
  const chars = {};
  for (const c of story.characters || []) {
    const id = c.id, mood = ctx.getCharacterMood?.(id), emotions = ctx.getCharacterEmotions?.(id) || {}, sentiments = ctx.getCharacterSentiments?.(id) || [];
    chars[id] = { id, name: c.name, about: c.description, mood, emotions, sentiments, reflections: ctx.getCharacterReflections?.(id) || [], variant: ctx.getActiveCharacterVariant?.(id), goals: c.goals || [], face: faceFor(id, mood, emotions, sentiments) };
  }
  return {
    chars, counters: ctx.getCharacterCountersFor('char_player') || {}, goals: ctx.getCharacterGoalStatuses?.('char_player') || {},
    inventory: (ctx.getInventoryEntries?.() || []).filter(e => e.quantity > 0),
    vars: Object.fromEntries((story.variables || []).map(v => [v.name, ctx.getVariable(v.name)])),
    visited: new Set(ctx.getVisitedBeats?.() || []),
  };
}

// Why a choice is closed, in the player's terms.
const VAR_WHY = {
  knowsFatherCraft: 'Only if you remembered his lathe (the calipers on your desk)', mentoredInes: "Only if you answered Ines's late message",
  passedOnCraft: 'Only if you passed your craft on to Ines', calledHome: 'Only before you call home', stalled: 'Only if you stalled at the Call', roleUnneeded: 'Only if the role turned out not to be needed',
};
export function why(c, world, beats) {
  const cur = k => world?.counters?.[k] ?? world?.vars?.[k] ?? 0;
  if (c.type === 'inventory') { const have = world?.inventory?.some(e => e.name === c.item); return have ? `Uses the ${c.item}` : `Needs the ${c.item}: you didn't take it`; }
  if (c.type === 'counter') { const L = COUNTERS[c.variable] || c.variable; return c.operator === '<=' ? `Only if ${L} is ${c.value} or less (you have ${cur(c.variable)})` : `Needs ${L} ${c.value} or more (you have ${cur(c.variable)})`; }
  if (c.type === 'visitedBeat') return `Only if you have been to ${beats.get(c.beatId)?.name || c.beatId}`;
  if (c.type === 'variable') {
    if (/^visited_/.test(c.variable)) return 'Already visited';
    if (c.variable === 'callChoice') return c.value === 'accept' ? 'Only if you took the team-lead role' : `Only if your answer at the Call was "${c.value}"`;
    return VAR_WHY[c.variable] || 'Depends on an earlier choice';
  }
  return 'Depends on an earlier choice';
}
