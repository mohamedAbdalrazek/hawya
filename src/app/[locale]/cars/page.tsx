// app/cars/page.tsx
import React, { Suspense } from "react";
import styles from "./CarsPage.module.css"; // Adjust the path as necessary
import CarsFilters from "@/components/cars-page/cars-filter/CarsFilter";
import CarsGrid from "@/components/cars-page/cars-grid/CarsGrid";
import { useTranslations } from "next-intl";
// app/(your-locale)/cars/page.tsx

export const metadata = {
    title: "Browse Rental Cars – Daily & Monthly Car Hire | Hawya Saudi Arabia",
    description:
        "Find the perfect car to rent in Saudi Arabia. Filter by price, type, model, or year. Hawya offers flexible daily and monthly rental options with full insurance.",
    keywords: [
        "rent a car Saudi Arabia",
        "car rental Dammam",
        "monthly car rental KSA",
        "SUV rental Saudi",
        "cheap car hire Khobar",
        "luxury car rental Jubail",
        "flexible car rental Saudi Arabia",
        "daily car rental KSA",
        "car booking online Saudi",
        "Hawya fleet",
    ],
    openGraph: {
        title: "Explore Hawya's Rental Fleet – Book Cars Across Saudi Arabia",
        description:
            "Browse Hawya’s growing fleet of rental vehicles. Filter by type, price, or year. Instant online booking available across Saudi cities.",
        url: "https://www.hawya-rental.com/cars",
        siteName: "Hawya",
        type: "website",
        images: [
            {
                url: "https://www.hawya-rental.com/og/cars.jpg", // Replace with actual OG image
                width: 1200,
                height: 630,
                alt: "Grid of rental cars available from Hawya in Saudi Arabia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Rent Cars Online in Saudi Arabia – Hawya Fleet",
        description:
            "Discover daily and monthly car rentals from Hawya. Filter by type, year, model, or price. Book online easily.",
        images: ["https://www.hawya-rental.com/og/cars.jpg"],
    },
    alternates: {
        canonical: "https://www.hawya-rental.com/cars",
        languages: {
            en: "https://www.hawya-rental.com/en/cars",
            ar: "https://www.hawya-rental.com//ar/cars",
        },
    },
    robots: {
        index: true,
        follow: true,
    },
};

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
