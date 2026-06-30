import { Helmet } from "react-helmet-async";

interface PublicPageProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  /** Open Graph image URL. */
  image?: string;
  /** Set true on pages that should not be indexed (auth, dashboards). */
  noindex?: boolean;
}

const SUFFIX = "Interior bazzar";

/**
 * Page-level SEO. Render as the FIRST child of every page:
 *   <PublicPage title={c.seo.title} description={c.seo.description} canonicalUrl={c.seo.canonicalUrl} />
 */
export function PublicPage({ title, description, canonicalUrl, image, noindex }: PublicPageProps) {
  const fullTitle = title.includes(SUFFIX) ? title : `${title} · ${SUFFIX}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
