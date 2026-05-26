import { ProductsAdmin } from "@/components/admin/products/products-admin";
import { SupabaseRequired } from "@/components/admin/supabase-required";

export default function AdminProdutosPage() {
  return (
    <SupabaseRequired>
      <ProductsAdmin />
    </SupabaseRequired>
  );
}

