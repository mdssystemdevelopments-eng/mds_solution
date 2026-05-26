import { BrandLogo } from "@/components/brand-logo";
import { LoginCard } from "@/components/admin/login/login-form";

export function AdminLoginShell() {
  return (
    <div className="login-solution relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="login-solution__bg" aria-hidden />
      <div className="login-solution__grid" aria-hidden />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="login-solution__logo-wrap">
            <BrandLogo variant="nav" className="h-12 max-h-12" priority />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-neon-blue">
            MDS Soluções
          </p>
        </div>
        <LoginCard />
      </div>
    </div>
  );
}
