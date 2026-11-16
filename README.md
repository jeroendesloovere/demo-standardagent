# Curator agent

Curator is a Standard Agent (spec 0.2.0). It keeps two lists: influencers and interesting projects.

## Tools

| Tool | Use | Parameters |
|------|-----|------------|
| `add_influencer` | Add an influencer to the list. | `name`, `platform`, `url`, `topics` (optional), `notes` (optional) |
| `add_interesting_project` | Add an interesting project to the list. | `name`, `url`, `description`, `tags` (optional), `notes` (optional) |

Each tool checks its input with zod. Each tool saves data as a durable user value (`state.user()`). The Builder runs on Cloudflare Workers. Workers have no persistent filesystem, so the tools do not use files.

| Key | Content |
|-----|---------|
| `influencers` | List of influencers |
| `projects` | List of interesting projects |

A tool does not add an entry when the same URL is already in the list. If storage fails, the tool returns an error with the real cause.

## Layout

```
agents/
  models/conversational.ts   model (OpenRouter)
  prompts/curator.ts         prompt and tool list
  agents/curator.ts          agent (human on side B)
  tools/                     the two tools
  lib/store.ts               storage (durable user values)
```

## Use

1. Run `npm install`.
2. Set the `OPENROUTER_API_KEY` environment variable (for example in a `.env` file). Do not commit the key. `.env` is in `.gitignore`.
3. Run `npm run typecheck` to check the types.
4. Start the Builder: `npx @standardagents/cli@latest init`. Put the `agents/` folder in your Builder project.
5. Open the `curator` agent and send a message, for example: "Add influencer Jane Doe, https://x.com/jane".

The data stays in the user storage of the Builder runtime. It is not in the repository.
