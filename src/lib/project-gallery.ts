import type { PortfolioItem } from "@/types/site-content";

export function projectGallery(item: Pick<PortfolioItem, "image" | "images">): string[] {
  const list = [item.image, ...(item.images ?? [])]
    .map((src) => src.trim())
    .filter(Boolean);
  return [...new Set(list)];
}
