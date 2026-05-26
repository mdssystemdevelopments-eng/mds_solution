import { getSiteContentAsync } from "@/lib/site-content";
import { Hero } from "@/components/hero";
import { HomeServices } from "@/components/home-services";
import { HomeFeaturedWork } from "@/components/home-featured-work";
import { HomeProcess, HomeCta } from "@/components/home-process";

export default async function HomePage() {
  const content = await getSiteContentAsync();
  return (
    <>
      <Hero content={content} />
      <HomeServices content={content} />
      <HomeFeaturedWork content={content} />
      <HomeProcess content={content} />
      <HomeCta content={content} />
    </>
  );
}
