import type { ThreadState } from '@standardagents/spec';

// Workers have no persistent filesystem. Use the durable user values of the spec.
const normalize = (url: string) => url.toLowerCase().replace(/\/+$/, '');

type Entry = { url: string } & Record<string, unknown>;
type Key = 'influencers' | 'projects';

async function getUser(state: Pick<ThreadState, 'user'>) {
  const user = await state.user();
  if (!user) {
    throw new Error('This thread has no user, so durable storage is not available.');
  }
  return user;
}

export async function listEntries<T extends Entry = Entry>(
  state: Pick<ThreadState, 'user'>,
  key: Key,
): Promise<T[]> {
  const user = await getUser(state);
  return (await user.getValue<T[]>(key)) ?? [];
}

export async function appendEntry(
  state: Pick<ThreadState, 'user'>,
  key: Key,
  entry: Entry,
): Promise<{ added: boolean; total: number }> {
  const user = await getUser(state);
  const items = (await user.getValue<Entry[]>(key)) ?? [];

  if (items.some((item) => normalize(item.url) === normalize(entry.url))) {
    return { added: false, total: items.length };
  }

  const next = [...items, entry];
  await user.setValue(key, next);
  return { added: true, total: next.length };
}
