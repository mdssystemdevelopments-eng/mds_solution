import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { addVisit, getCompany, getProjectBySlug } from "@/lib/business/store";
import { businessAccessToken, businessCookieName } from "@/lib/business/password";
import { isAdminSession } from "@/lib/admin-session";
import { BusinessPublicView } from "@/components/business/business-public-view";
import { BusinessUnlockForm } from "@/components/business/business-unlock-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "published") {
    return { title: "Business", robots: { index: false, follow: false } };
  }
  return {
    title: project.seo.title || project.title,
    description: project.seo.description || project.description,
    robots: project.seo.robots === "index" && project.visibility === "public"
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: project.seo.title || project.title,
      description: project.seo.description || project.description,
      images: project.seo.ogImage || project.cover ? [project.seo.ogImage || project.cover] : undefined,
    },
    icons: project.design.favicon ? { icon: project.design.favicon } : undefined,
  };
}

export default async function BusinessPublicPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const admin = await isAdminSession();
  if (!project) notFound();
  if (!admin && project.status !== "published") notFound();

  if (!admin && project.visibility === "private" && project.passwordHash) {
    const token = (await cookies()).get(businessCookieName(project.id))?.value;
    const expected = businessAccessToken(project.id, project.passwordHash);
    if (token !== expected) {
      return <BusinessUnlockForm slug={project.slug} />;
    }
  }

  if (!admin) {
    await addVisit({
      projectId: project.id,
      kind: "view",
      meta: { path: `/business/${project.slug}` },
    });
  }

  const company = project.companyId ? await getCompany(project.companyId) : null;
  return <BusinessPublicView project={project} company={company} />;
}
