// src/components/FleetPreview/FleetPreview.tsx
"use client";
import React from "react";
import styles from "./FleetPreview.module.css";
import Link from "next/link";
import CarImagesSlider from "./CarImagesSlider";
const cars = [
    {
        id: 1,
        model: "Toyota Corolla",
        type: "Sedan",
        color: "white",
        year: 2022,
        transmission: "Automatic",
        priceMonth: 2500,
        priceDay: 100,
        images: [
            "/cars/toyota-corolla-1.jpg",
            "/cars/toyota-corolla-2.jpg",
            "/cars/toyota-corolla-3.jpg",
        ],
    },
    {
        id: 2,
        model: "Toyota Yaris",
        type: "Hatchback",
        color: "gray",
        year: 2023,
        transmission: "Automatic",
        priceMonth: 2500,
        priceDay: 100,
        images: [
            "/cars/toyota-yaris-1.jpg",
            "/cars/toyota-yaris-2.jpg",
            "/cars/toyota-yaris-3.jpg",
        ],
    },
    {
        id: 3,
        model: "Chery Tiggo",
        type: "Compact SUV",
        color: "white",
        year: 2024,
        transmission: "Automatic",
        priceMonth: 3500,
        priceDay: 140,
        images: [
            "/cars/chery-tiggo-1.jpg",
            "/cars/chery-tiggo-2.jpg",
            "/cars/chery-tiggo-3.jpg",
        ],
    },
    {
        id: 4,
        model: "Hyundai Accent",
        type: "Sedan",
        color: "red",
        year: 2021,
        transmission: "Automatic",
        priceMonth: 2800,
        priceDay: 110,
        images: [
            "/cars/hyundai-accent-1.jpg",
            "/cars/hyundai-accent-2.jpg",
            "/cars/hyundai-accent-3.jpg",
        ],
    },
    {
        id: 5,
        model: "Kia Rio",
        type: "Sedan",
        color: "gray",
        year: 2024,
        transmission: "Automatic",
        priceMonth: 2700,
        priceDay: 105,
        images: [
            "/cars/kia-rio-1.jpg",
            "/cars/kia-rio-2.jpg",
            "/cars/kia-rio-3.jpg",
        ],
    },
    {
        id: 6,
        model: "Kia Sportage",
        type: "SUV",
        color: "white",
        year: 2025,
        transmission: "Automatic",
        priceMonth: 4500,
        priceDay: 180,
        images: [
            "/cars/kia-sportage-1.jpg",
            "/cars/kia-sportage-2.jpg",
            "/cars/kia-sportage-3.jpg",
        ],
    },
];
const FleetPreview = () => {
    return (
        <section className={styles.fleet} id="fleet">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Premium Fleet</h2>
                    <p className={styles.subtitle}>
                        Explore our selection of well-maintained vehicles
                        perfect for Saudi roads
                    </p>
                </div>

                <div className={styles.grid}>
                    {cars.map((car) => (
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
                                    href={`/cars/${car.id}`}
                                    className={styles.ctaButton}
                                >
                                    View Details
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
