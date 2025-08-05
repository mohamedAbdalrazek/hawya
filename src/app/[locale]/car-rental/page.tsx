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
            url: "https://www.hawya-rental.com/car-rental",
            siteName: "Hawya",
            type: "website",
            images: [
                {
                    url: "https://www.hawya-rental.com/og/cars.jpg",
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
            images: ["https://www.hawya-rental.com/og/cars.jpg"],
        },
        alternates: {
            canonical: "https://www.hawya-rental.com/car-rental",
            languages: {
                en: "https://www.hawya-rental.com/en/car-rental",
                ar: "https://www.hawya-rental.com/ar/car-rental",
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
