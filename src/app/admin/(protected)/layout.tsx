import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-routes";
import { isAdminSession } from "@/lib/admin-session";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminSession())) redirect(ADMIN_LOGIN_PATH);
  return <AdminShell>{children}</AdminShell>;
}
