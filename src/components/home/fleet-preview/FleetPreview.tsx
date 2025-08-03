"use client";

import React, { useEffect, useState } from "react";
import styles from "./FleetPreview.module.css";
import Link from "next/link";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { useTranslations } from "next-intl";
import CarCard from "@/components/cars-page/CarCard/CarCard";
import { ClientCarMap } from "@/utils/types";
import CarsSkeletonLoading from "@/components/global/skeleton-loading/CarsSkeletonLoading";
import NoCarsFound from "@/components/global/no-car-found/NoCarsFound";

const FleetPreview = () => {
    const t = useTranslations("CarsSection");
    const [cars, setCars] = useState<ClientCarMap[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchCars = async () => {
        try {
            setLoading(true);
            const callParams = `?offset=${0}&limit=${6}`;
            const response = await fetch(`/api/getCars${callParams}`);
            if (response.ok) {
                const data = await response.json();
                setCars(data.cars);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <section className={styles.fleet} id="fleet">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("homeHeading")} />
                    <p className={styles.subtitle}>{t("homeSubtitle")}</p>
                </div>

                {loading ? (
                    <CarsSkeletonLoading number={6} />
                ) : !cars || !cars.length ? (
                    <NoCarsFound />
                ) : (
                    <div className={styles.grid}>
                        {cars.map((car) => (
                            <CarCard car={car} key={`${car.id}`} />
                        ))}
                    </div>
                )}

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
