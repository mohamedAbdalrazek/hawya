// app/cars/page.tsx
import React, { Suspense } from "react";
import styles from "./CarsPage.module.css"; // Adjust the path as necessary
import CarsFilters from "@/components/cars-page/cars-filter/CarsFilter";
import CarsGrid from "@/components/cars-page/cars-grid/CarsGrid";
import { useTranslations } from "next-intl";
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
