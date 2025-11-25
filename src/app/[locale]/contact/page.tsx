import Contact from "@/components/home/contact/Contact";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        title: t("contact.title"),
        description: t("contact.description"),
        keywords: t("contact.keywords")
            .split(",")
            .map((kw) => kw.trim()),
        openGraph: {
            title: t("contact.ogTitle"),
            description: t("contact.ogDescription"),
            url: "https://www.marakeb.co/contact",
            siteName: "Marakeb",
            type: "website",
            images: [
                {
                    url: "https://www.marakeb.co/og/contact.jpg",
                    width: 1200,
                    height: 630,
                    alt: t("contact.ogAlt"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("contact.twitterTitle"),
            description: t("contact.twitterDescription"),
            images: ["https://www.marakeb.co/og/home.jpg"],
        },
        alternates: {
            canonical: "https://www.marakeb.co/contact",
            languages: {
                en: "https://www.marakeb.co/en/contact",
                ar: "https://www.marakeb.co/ar/contact",
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
            <Contact />
        </div>
    );
}
