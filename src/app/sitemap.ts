import { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";

export const runtime = "edge";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://magicv.art/";

  const routes = [defaultLocale, ...locales.filter((locale) => locale !== defaultLocale)];

  const sitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0
  }));

  return sitemap;
}
