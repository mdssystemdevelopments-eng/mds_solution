import { redirect } from "next/navigation";
import { AdminLoginShell } from "@/components/admin/login/admin-login-shell";
import { isAdminSession } from "@/lib/admin-session";

export default async function LoginSolutionPage() {
  if (await isAdminSession()) redirect("/admin/conteudo");
  return <AdminLoginShell />;
}
