type SlugifyOptions = {
  maxLength?: number;
};

/** Normaliza texto para slug URL-safe. */
export function slugify(input: string, options: SlugifyOptions = {}) {
  const maxLength = options.maxLength ?? 200;
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, maxLength);
}
