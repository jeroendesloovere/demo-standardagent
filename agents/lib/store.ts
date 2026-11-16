import type { ThreadState } from '@standardagents/spec';

// Workers have no persistent filesystem. Use the durable user values of the spec.
const normalize = (url: string) => url.toLowerCase().replace(/\/+$/, '');

type Entry = { url: string } & Record<string, unknown>;

export async function appendEntry(
  state: Pick<ThreadState, 'user'>,
  key: 'influencers' | 'projects',
  entry: Entry,
): Promise<{ added: boolean; total: number }> {
  const user = await state.user();
  if (!user) {
    throw new Error('This thread has no user, so durable storage is not available.');
  }

  const items = (await user.getValue<Entry[]>(key)) ?? [];

  if (items.some((item) => normalize(item.url) === normalize(entry.url))) {
    return { added: false, total: items.length };
  }

  const next = [...items, entry];
  await user.setValue(key, next);
  return { added: true, total: next.length };
}
