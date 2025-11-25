import { MetadataRoute } from "next";

const BASE_URL = "https://www.marakeb.co/";

export default async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/en/`, lastModified: new Date() },
        { url: `${BASE_URL}/en/cars`, lastModified: new Date() },
        { url: `${BASE_URL}/en/about`, lastModified: new Date() },
        { url: `${BASE_URL}/en/contact`, lastModified: new Date() },
        { url: `${BASE_URL}/en/locations`, lastModified: new Date() },
        { url: `${BASE_URL}/en/car-rental`, lastModified: new Date() },

        // Arabic routes if applicable
        { url: `${BASE_URL}/ar`, lastModified: new Date() },
        { url: `${BASE_URL}/ar/cars`, lastModified: new Date() },
        { url: `${BASE_URL}/ar/about`, lastModified: new Date() },
        { url: `${BASE_URL}/ar/contact`, lastModified: new Date() },
        { url: `${BASE_URL}/ar/locations`, lastModified: new Date() },
        { url: `${BASE_URL}/ar/car-rental`, lastModified: new Date() }
    ];

    return staticRoutes;
}
