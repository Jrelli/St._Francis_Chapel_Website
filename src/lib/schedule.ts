/** Loads and validates src/data/schedule.yaml at build time. */
import { z } from 'astro/zod';
import raw from '../data/schedule.yaml?raw';
import { parseYamlData } from './yaml-data';

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

export const schedule: Schedule = parseYamlData(raw, ScheduleSchema, 'src/data/schedule.yaml');
