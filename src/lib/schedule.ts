/**
 * Loads and validates src/data/schedule.yaml at build time.
 * Zod checks the shape, so a volunteer's typo fails the build with a readable message
 * instead of publishing a half-empty schedule.
 */
import { z } from 'astro/zod';
import { parse } from 'yaml';
import raw from '../data/schedule.yaml?raw';

const ItemSchema = z.object({
  days: z.string().min(1),
  time: z.string().default(''),
  what: z.string().optional(),
  location: z.string().optional(),
  details: z.string().optional(),
  confirmed: z.boolean().default(false),
});

const ScheduleSchema = z.object({
  note: z.string().optional(),
  sections: z
    .array(z.object({ title: z.string().min(1), items: z.array(ItemSchema).min(1) }))
    .min(1),
});

export type Schedule = z.infer<typeof ScheduleSchema>;
export type ScheduleItem = z.infer<typeof ItemSchema>;

function load(): Schedule {
  const result = ScheduleSchema.safeParse(parse(raw));
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `  - ${i.path.join(' → ') || '(top level)'}: ${i.message}`)
      .join('\n');
    throw new Error(`src/data/schedule.yaml has a problem:\n${problems}`);
  }
  return result.data;
}

export const schedule = load();
