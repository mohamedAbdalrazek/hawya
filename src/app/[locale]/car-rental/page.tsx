import React from "react";
import BookingForm from "./BookingClient";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata>{
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta.carRental" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "https://www.marakeb.co/car-rental",
            siteName: "Marakeb",
            type: "website",
            images: [
                {
                    url: "https://www.marakeb.co/og/home.jpg",
                    width: 1200,
                    height: 630,
                    alt: t("ogAlt"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("twitterTitle"),
            description: t("twitterDescription"),
            images: ["https://www.marakeb.co/og/cars.jpg"],
        },
        alternates: {
            canonical: "https://www.marakeb.co/car-rental",
            languages: {
                en: "https://www.marakeb.co/en/car-rental",
                ar: "https://www.marakeb.co/ar/car-rental",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
export default function page() {
    return <BookingForm />;
}
