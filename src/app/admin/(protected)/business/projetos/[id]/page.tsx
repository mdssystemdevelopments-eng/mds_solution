import { BusinessEditor } from "@/components/admin/business/business-editor";

export default async function AdminBusinessProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BusinessEditor id={id} />;
}
