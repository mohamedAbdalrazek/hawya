// src/components/FleetPreview/FleetPreview.tsx
"use client";
import React from "react";
import styles from "./FleetPreview.module.css";
import Link from "next/link";
import CarImagesSlider from "./CarImagesSlider";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { cars } from "@/utils/info";

const FleetPreview = () => {
    return (
        <section className={styles.fleet} id="fleet">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text="Our Fleet" />
                    <p className={styles.subtitle}>
                        Explore our selection of well-maintained vehicles
                        perfect for Saudi roads
                    </p>
                </div>

                <div className={styles.grid}>
                    {cars.slice(0,6).map((car) => (
                        <div key={car.id} className={styles.card}>
                            <CarImagesSlider images={car.images} />

                            <div className={styles.priceTag}>
                                <span className={styles.price}>
                                    SAR {car.priceDay} / day
                                </span>
                                <span className={styles.priceLabel}></span>
                                <span className={styles.monthlyPrice}>
                                    SAR {car.priceMonth} / month
                                </span>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.modelHeader}>
                                    <h3 className={styles.model}>
                                        {car.model}
                                    </h3>
                                    <span className={styles.year}>
                                        {car.year}
                                    </span>
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>
                                            Type:
                                        </span>
                                        <span>{car.type}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>
                                            Color:
                                        </span>
                                        <span>{car.color}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>
                                            Transmission:
                                        </span>
                                        <span>{car.transmission}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`#`}
                                    className={styles.ctaButton}
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/cars" className={styles.primaryButton}>
                        View Full Fleet
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FleetPreview;
