import { defineTool } from '@standardagents/spec';
import { z } from 'zod';
import { listEntries } from '../lib/store';

export default defineTool({
  description:
    'List the saved influencers. Use this when the user asks to see or find influencers. You can filter by platform or topic.',
  args: z.object({
    platform: z
      .enum(['linkedin', 'x', 'youtube', 'instagram', 'tiktok', 'github', 'blog', 'other'])
      .optional()
      .describe('Return only influencers on this platform.'),
    topic: z.string().trim().min(1).optional().describe('Return only influencers with this topic (not case sensitive).'),
    limit: z.number().int().min(1).max(100).optional().describe('Maximum number of results. Default is 50.'),
  }),
  execute: async (state, args) => {
    try {
      const topic = args.topic?.toLowerCase();
      const items = (await listEntries(state, 'influencers'))
        .filter((item) => !args.platform || item.platform === args.platform)
        .filter(
          (item) =>
            !topic ||
            (Array.isArray(item.topics) &&
              item.topics.some((t) => typeof t === 'string' && t.toLowerCase() === topic)),
        );
      const results = items.slice(0, args.limit ?? 50);
      return {
        status: 'success',
        result: JSON.stringify({ total: items.length, returned: results.length, influencers: results }),
      };
    } catch (error) {
      return { status: 'error', error: `Could not read influencers: ${(error as Error).message}` };
    }
  },
});
