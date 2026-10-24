import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cargo-am.vercel.app";
  const now = new Date();

  const routes = [
    "",
    "/tracking",
    "/quotes",
    "/shipments",
    "/clients",
    "/finances",
    "/portal",
    "/legal",
    "/preferences",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/tracking" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/tracking" || route === "/quotes" ? 0.9 : 0.7,
  }));
}
