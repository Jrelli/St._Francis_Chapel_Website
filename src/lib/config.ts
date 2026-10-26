import type { Fact } from '../config/site';

/** True when a fact has something worth showing (non-blank string or non-empty list). */
export function has(f: Fact<string> | Fact<string[]>): boolean {
  const v = f.value;
  return Array.isArray(v) ? v.some((line) => line.trim() !== '') : v.trim() !== '';
}

function isFact(x: unknown): x is Fact<unknown> {
  return typeof x === 'object' && x !== null && 'value' in x && 'confirmed' in x;
}

/** Walks the config and returns every unconfirmed fact with its dotted path. */
export function unconfirmedFacts(
  obj: Record<string, unknown>,
  prefix = '',
): { path: string; fact: Fact<unknown> }[] {
  return Object.entries(obj).flatMap(([key, val]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isFact(val)) return val.confirmed ? [] : [{ path, fact: val }];
    if (typeof val === 'object' && val !== null) {
      return unconfirmedFacts(val as Record<string, unknown>, path);
    }
    return [];
  });
}
