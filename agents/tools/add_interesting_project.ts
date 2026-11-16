import { defineTool } from '@standardagents/spec';
import { z } from 'zod';
import { appendEntry } from '../lib/store';

export default defineTool({
  description:
    'Add an interesting project to the list. Use this when the user finds a project worth keeping.',
  args: z.object({
    name: z.string().trim().min(1).describe('Name of the project.'),
    url: z.string().url().describe('URL of the project (for example a repository or website).'),
    description: z.string().trim().min(1).describe('Short description of the project.'),
    tags: z.array(z.string().trim().min(1)).default([]).describe('Tags that group the project.'),
    notes: z.string().optional().describe('Short note. Say why the project is interesting.'),
  }),
  execute: async (_state, args) => {
    try {
      const { added, total } = await appendEntry('projects.json', {
        ...args,
        addedAt: new Date().toISOString(),
      });
      return {
        status: 'success',
        result: added
          ? `Added project "${args.name}". The list has ${total} projects.`
          : `Project with URL ${args.url} is already in the list. Nothing changed.`,
      };
    } catch (error) {
      return { status: 'error', error: `Could not save project: ${(error as Error).message}` };
    }
  },
});
