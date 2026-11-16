import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');

const normalize = (url: string) => url.toLowerCase().replace(/\/+$/, '');

type Entry = { url: string } & Record<string, unknown>;

export async function appendEntry(
  file: string,
  entry: Entry,
): Promise<{ added: boolean; total: number }> {
  const target = path.join(DATA_DIR, file);
  await fs.mkdir(DATA_DIR, { recursive: true });

  let items: Entry[] = [];
  try {
    items = JSON.parse(await fs.readFile(target, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }

  if (items.some((item) => normalize(item.url) === normalize(entry.url))) {
    return { added: false, total: items.length };
  }

  items.push(entry);
  await fs.writeFile(target, JSON.stringify(items, null, 2) + '\n', 'utf8');
  return { added: true, total: items.length };
}
