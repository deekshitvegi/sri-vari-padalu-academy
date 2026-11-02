import { notFound } from "next/navigation";
import { getPublicSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";

export const dynamic = "force-dynamic";
export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPublicSiteContent();
  const page = managedPageFor(content, slug);
  if (!page || page.builtIn) notFound();
  return <BuilderPage page={page} content={content} />;
}
