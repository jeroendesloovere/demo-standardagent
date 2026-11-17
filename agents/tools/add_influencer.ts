import { defineTool } from '@standardagents/spec';
import { z } from 'zod';
import { appendEntry } from '../lib/store';

export default defineTool({
  description:
    'Add an influencer to the list. Use this when the user names a person to follow or track.',
  args: z.object({
    name: z.string().trim().min(1).describe('Full name or public handle of the influencer.'),
    platform: z
      .enum(['linkedin', 'x', 'youtube', 'instagram', 'tiktok', 'github', 'blog', 'other'])
      .describe('Main platform of the influencer.'),
    url: z.string().url().describe('URL of the influencer profile.'),
    topics: z.array(z.string().trim().min(1)).default([]).describe('Topics the influencer writes about.'),
    notes: z.string().optional().describe('Short note. Say why this influencer is useful.'),
  }),
  execute: async (state, args) => {
    try {
      const { added, total } = await appendEntry(state, 'influencers', {
        ...args,
        addedAt: new Date().toISOString(),
      });
      return {
        status: 'success',
        result: added
          ? `Added influencer "${args.name}". The list has ${total} influencers.`
          : `Influencer with URL ${args.url} is already in the list. Nothing changed.`,
      };
    } catch (error) {
      return { status: 'error', error: `Could not save influencer: ${(error as Error).message}` };
    }
  },
});
