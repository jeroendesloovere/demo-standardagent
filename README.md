# Curator agent

Curator is a Standard Agent (spec 0.2.0). It keeps two lists: influencers and interesting projects.

## Tools

| Tool | Use | Parameters |
|------|-----|------------|
| `add_influencer` | Add an influencer to the list. | `name`, `platform`, `url`, `topics` (optional), `notes` (optional) |
| `add_interesting_project` | Add an interesting project to the list. | `name`, `url`, `description`, `tags` (optional), `notes` (optional) |

Each tool checks its input with zod. Each tool saves data in a JSON file:

- `data/influencers.json`
- `data/projects.json`

A tool does not add an entry when the same URL is already in the file.

## Layout

```
agents/
  models/conversational.ts   model (OpenRouter)
  prompts/curator.ts         prompt and tool list
  agents/curator.ts          agent (human on side B)
  tools/                     the two tools
  lib/store.ts               JSON file storage
```

## Use

1. Run `npm install`.
2. Set your OpenRouter key in the Standard Agents runtime.
3. Run `npm run typecheck` to check the types.
4. Load the `agents/` folder in a Standard Agents builder.

The `data/` folder is made at the first save, in the current working directory.
