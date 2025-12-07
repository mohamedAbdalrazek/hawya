// app/cars/page.tsx
import React, { Suspense } from "react";
import styles from "./CarsPage.module.css"; // Adjust the path as necessary
import CarsFilters from "@/components/cars-page/cars-filter/CarsFilter";
import CarsGrid from "@/components/cars-page/cars-grid/CarsGrid";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
// app/(your-locale)/cars/page.tsx

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const {locale} = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        title: t("cars.title"),
        description: t("cars.description"),
        keywords: t("cars.keywords")
            .split(",")
            .map((kw) => kw.trim()),
        openGraph: {
            title: t("cars.ogTitle"),
            description: t("cars.ogDescription"),
            url: "https://www.marakeb.co/cars",
            siteName: "Marakeb",
            type: "website",
            images: [
                {
                    url: "https://www.marakeb.co/og/home.jpg",
                    width: 1200,
                    height: 630,
                    alt: t("cars.ogAlt"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("cars.twitterTitle"),
            description: t("cars.twitterDescription"),
            images: ["https://www.marakeb.co/og/cars.jpg"],
        },
        alternates: {
            canonical: "https://www.marakeb.co/cars",
            languages: {
                en: "https://www.marakeb.co/en/cars",
                ar: "https://www.marakeb.co/ar/cars",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

function Cars() {
    return <CarsGrid />;
}
function Filters() {
    return <CarsFilters />;
}

const CarsPage = () => {
    const t = useTranslations("CarsPage");
    return (
        <main className={styles.pageContainer}>
            <section className={styles.headerSection}>
                <div className={`${styles.container} container`}>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>
            </section>

            <Suspense>
                <Filters />
            </Suspense>
            <Suspense>
                <Cars />
            </Suspense>
        </main>
    );
};

export default CarsPage;
