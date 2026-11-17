import { defineTool } from '@standardagents/spec';
import { z } from 'zod';
import { listEntries } from '../lib/store';

export default defineTool({
  description:
    'List the saved interesting projects. Use this when the user asks to see or find projects. You can filter by tag.',
  args: z.object({
    tag: z.string().trim().min(1).optional().describe('Return only projects with this tag (not case sensitive).'),
    limit: z.number().int().min(1).max(100).optional().describe('Maximum number of results. Default is 50.'),
  }),
  execute: async (state, args) => {
    try {
      const tag = args.tag?.toLowerCase();
      const items = (await listEntries(state, 'projects')).filter(
        (item) =>
          !tag ||
          (Array.isArray(item.tags) &&
            item.tags.some((t) => typeof t === 'string' && t.toLowerCase() === tag)),
      );
      const results = items.slice(0, args.limit ?? 50);
      return {
        status: 'success',
        result: JSON.stringify({ total: items.length, returned: results.length, projects: results }),
      };
    } catch (error) {
      return { status: 'error', error: `Could not read projects: ${(error as Error).message}` };
    }
  },
});
