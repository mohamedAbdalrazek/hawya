"use client";

import React from "react";
import styles from "./FleetPreview.module.css";
import Link from "next/link";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { cars } from "@/utils/info";
import { useTranslations } from "next-intl";
import CarCard from "@/components/cars-page/CarCard/CarCard";

const FleetPreview = () => {
    const t = useTranslations("CarsSection");

    return (
        <section className={styles.fleet} id="fleet">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("homeHeading")} />
                    <p className={styles.subtitle}>{t("homeSubtitle")}</p>
                </div>

                <div className={styles.grid}>
                    {cars.slice(0, 6).map((car) => (
                        <CarCard car={car} key={`${car.brand} ${car.model}`} />
                        // <div key={car.id} className={styles.card}>
                        //     <CarImagesSlider images={car.images} />

                        //     <div className={styles.priceTag}>
                        //         <span className={styles.price}>
                        //             {t("pricePerDay", { price: car.priceDay })}
                        //         </span>
                        //         <span className={styles.priceLabel}></span>
                        //         <span className={styles.monthlyPrice}>
                        //             {t("pricePerMonth", {
                        //                 price: car.priceMonth,
                        //             })}
                        //         </span>
                        //     </div>

                        //     <div className={styles.content}>
                        //         <div className={styles.modelHeader}>
                        //             <h3 className={styles.model}>
                        //                 {car.model}
                        //             </h3>
                        //             <span className={styles.year}>
                        //                 {car.year}
                        //             </span>
                        //         </div>
                        //         <div className={styles.details}>
                        //             <div className={styles.detailItem}>
                        //                 <span className={styles.detailLabel}>
                        //                     {t("type")}
                        //                 </span>
                        //                 <span>{car.type}</span>
                        //             </div>
                        //             <div className={styles.detailItem}>
                        //                 <span className={styles.detailLabel}>
                        //                     {t("color")}
                        //                 </span>
                        //                 <span>{car.color}</span>
                        //             </div>
                        //             <div className={styles.detailItem}>
                        //                 <span className={styles.detailLabel}>
                        //                     {t("transmission")}
                        //                 </span>
                        //                 <span>{car.transmission}</span>
                        //             </div>
                        //         </div>

                        //         <Link href="#" className={styles.ctaButton}>
                        //             {t("bookNow")}
                        //         </Link>
                        //     </div>
                        // </div>
                    ))}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/cars" className={styles.primaryButton}>
                        {t("viewAll")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FleetPreview;
