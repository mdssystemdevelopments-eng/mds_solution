function isPlainObject(o: unknown): o is Record<string, unknown> {
  return o !== null && typeof o === "object" && !Array.isArray(o);
}

export function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T> | Record<string, unknown>): T {
  const out = { ...base };
  for (const k of Object.keys(override)) {
    const key = k as keyof T;
    const bv = base[key];
    const ov = override[k as string];
    if (ov === undefined) continue;
    if (Array.isArray(ov)) {
      (out as Record<string, unknown>)[k] = ov;
    } else if (isPlainObject(bv) && isPlainObject(ov)) {
      out[key] = deepMerge(bv as Record<string, unknown>, ov as Record<string, unknown>) as T[keyof T];
    } else {
      out[key] = ov as T[keyof T];
    }
  }
  return out;
}
