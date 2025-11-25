import Locations from "@/components/home/locations/Locations";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import React from "react";
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta.location" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"), // Must be a string
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "https://www.marakeb.co/locations",
            siteName: "Marakeb",
            type: "website",
            images: [
                {
                    url: "https://www.marakeb.co/og/home.jpg",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("twitterTitle"),
            description: t("twitterDescription"),
            images: ["https://www.marakeb.co/og/home.jpg"],
        },
        alternates: {
            canonical: "https://www.marakeb.co/locations",
            languages: {
                en: "https://www.marakeb.co/en/locations",
                ar: "https://www.marakeb.co/ar/locations",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
export default function page() {
    return (
        <div style={{ paddingTop: "80px" }}>
            <Locations />
        </div>
    );
}
