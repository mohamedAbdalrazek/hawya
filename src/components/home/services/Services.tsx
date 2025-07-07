// src/components/Services/Services.tsx
import React from "react";
import styles from "./Services.module.css";
import {
    FaCar,
    FaShieldAlt,
    FaMapMarkedAlt,
    FaHeadset,
    FaOilCan,
    FaClock,
} from "react-icons/fa";
import HomeHeading from "@/components/global/home-heading/HomeHeading";

const Services = () => {
    const services = [
        {
            icon: <FaCar className={styles.icon} />,
            title: "Diverse Fleet",
            description:
                "Choose from our premium selection of vehicles including luxury sedans, SUVs, and economy cars perfect for Saudi roads.",
        },
        {
            icon: <FaShieldAlt className={styles.icon} />,
            title: "Comprehensive Insurance",
            description:
                "Drive with peace of mind with our all-inclusive insurance coverage options.",
        },
        {
            icon: <FaMapMarkedAlt className={styles.icon} />,
            title: "Nationwide Coverage",
            description:
                "Pick up and drop off at multiple locations across major Saudi cities.",
        },
        {
            icon: <FaHeadset className={styles.icon} />,
            title: "24/7 Support",
            description:
                "Arabic and English speaking customer service available round the clock.",
        },
        {
            icon: <FaOilCan className={styles.icon} />,
            title: "Regular Maintenance",
            description:
                "All vehicles undergo rigorous maintenance checks for your safety.",
        },
        {
            icon: <FaClock className={styles.icon} />,
            title: "Flexible Rentals",
            description:
                "Hourly, daily, weekly or monthly rental options to suit your needs.",
        },
    ];

    return (
        <section className={styles.services} id="services">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text="Our Services" />
                    <p className={styles.subtitle}>
                        Hawya offers more than just car rentals - we provide
                        complete mobility solutions tailored for Saudi Arabia
                    </p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconContainer}>
                                {service.icon}
                            </div>
                            <h3 className={styles.cardTitle}>
                                {service.title}
                            </h3>
                            <p className={styles.cardDescription}>
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
