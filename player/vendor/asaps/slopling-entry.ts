// Slopling Odyssey runtime entry: the real ASAPS engine, plus the same
// JSON→Story loading path as packages/player/src/PlayerEngine.ts
// (createStoryFromJson) and builder/src/utils/generatedVariables.ts
// (mergeGeneratedVariables), so a Story Generator file plays as ASAPS plays it.
import { StoryEngine } from './src/engine/StoryEngine';
import { Story } from './src/engine/Story';
import { BeatTypeRegistry } from './src/beats/BeatRegistry';
export { StoryEngine, Story, BeatTypeRegistry };
export const ASAPS_CORE_VERSION = '2.0.0 (ASAPS Modern v0.9.133)';

function settingsVariables(vars: any[]): any[] {
  const t = (v: unknown) => typeof v === 'boolean' ? 'boolean' : typeof v === 'number' ? 'number' : 'string';
  return (vars || []).filter(v => v && typeof v.name === 'string' && v.name.trim()).map(v => ({
    name: v.name.trim(), type: t(v.initialValue),
    defaultValue: v.initialValue ?? (t(v.initialValue) === 'boolean' ? false : t(v.initialValue) === 'number' ? 0 : ''),
    description: typeof v.description === 'string' ? v.description : undefined,
  }));
}

export function storyFromGeneratedJson(data: any): Story {
  const storyData = data.project?.story || data.story || data.content || data;
  const story = new Story({ title: storyData.metadata?.title || 'Untitled Story', author: storyData.metadata?.author, firstBeatId: storyData.metadata?.firstBeatId });
  const registry = BeatTypeRegistry.getInstance();
  for (const b of storyData.beats || []) {
    const beat = registry.createBeat(b.type, {
      id: b.id, name: b.name || b.id, type: b.type, cluster: b.cluster, transition: b.transition, sound: b.sound,
      locations: b.locations || [], connections: b.connections || [], defaultTarget: b.defaultTarget, x: b.x, y: b.y,
      parameters: b.parameters || {},
    } as any);
    if (b.notes) (beat as any).notes = b.notes;
    if (b.speaker) (beat as any).speaker = b.speaker;
    if (b.showSpeaker != null) (beat as any).showSpeaker = b.showSpeaker;
    story.addBeat(beat);
  }
  const all = story.getAllBeats();
  if (!all.some(b => b.id === storyData.metadata?.firstBeatId)) {
    const t = all.find(b => b.type === 'titleScreen'); story.setFirstBeatId(t ? t.id : all[0].id);
  }
  story.setSettings({ ...(storyData.settings || {}), variables: settingsVariables(storyData.variables), roles: storyData.roles || [] });
  if (storyData.environment) story.setEnvironment(storyData.environment);
  if (storyData.characters) story.setCharacters(storyData.characters);
  return story;
}
