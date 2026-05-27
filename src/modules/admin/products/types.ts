export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  price_cents: number | null;
  currency: string;
  updated_at: string;
};

export type ProductPayload = {
  name: string;
  slug: string;
  description: string;
  price_cents: number | null;
  currency: string;
  active: boolean;
  images: string[];
};
