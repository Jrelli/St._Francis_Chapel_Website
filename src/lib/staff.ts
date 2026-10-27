/** Loads and validates src/data/staff.yaml at build time. */
import { z } from 'astro/zod';
import raw from '../data/staff.yaml?raw';
import { parseYamlData } from './yaml-data';

const PersonSchema = z.object({ role: z.string().min(1), name: z.string().min(1) });

const StaffSchema = z.object({
  groups: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        people: z.array(PersonSchema).min(1),
      }),
    )
    .min(1),
});

export type StaffGroup = z.infer<typeof StaffSchema>['groups'][number];

export const staffGroups: StaffGroup[] = parseYamlData(
  raw,
  StaffSchema,
  'src/data/staff.yaml',
).groups;

/** A group by its `id`; fails the build if the id is missing, so typos are caught. */
export function staffGroup(id: string): StaffGroup {
  const group = staffGroups.find((g) => g.id === id);
  if (!group) throw new Error(`src/data/staff.yaml: no group with id "${id}"`);
  return group;
}
