/**
 * Parses an editable YAML data file and validates it with a Zod schema at build time.
 * A typo fails the build with a readable message naming the file and the bad field,
 * instead of publishing a half-empty page.
 */
import type { z } from 'astro/zod';
import { parse } from 'yaml';

export function parseYamlData<S extends z.ZodType>(
  raw: string,
  schema: S,
  file: string,
): z.infer<S> {
  const result = schema.safeParse(parse(raw));
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `  - ${i.path.join(' → ') || '(top level)'}: ${i.message}`)
      .join('\n');
    throw new Error(`${file} has a problem:\n${problems}`);
  }
  return result.data;
}

/** Splits text on blank lines into paragraphs (for multi-paragraph YAML answers). */
export const paragraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
