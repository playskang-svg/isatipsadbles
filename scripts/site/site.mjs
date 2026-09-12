export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://isatips.adbles.com").replace(/\/$/u, "");

export function articleUrl(slug) {
  return `${SITE_URL}/articles/${slug}`;
}
