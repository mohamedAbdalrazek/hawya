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

import { useTranslations } from "next-intl";

const Services = () => {
    const t = useTranslations("Services");

    const services = [
        {
            icon: <FaCar className={styles.icon} />,
            title: t("items.diverseFleet.title"),
            description: t("items.diverseFleet.description"),
        },
        {
            icon: <FaShieldAlt className={styles.icon} />,
            title: t("items.comprehensiveInsurance.title"),
            description: t("items.comprehensiveInsurance.description"),
        },
        {
            icon: <FaMapMarkedAlt className={styles.icon} />,
            title: t("items.nationwideCoverage.title"),
            description: t("items.nationwideCoverage.description"),
        },
        {
            icon: <FaHeadset className={styles.icon} />,
            title: t("items.support.title"),
            description: t("items.support.description"),
        },
        {
            icon: <FaOilCan className={styles.icon} />,
            title: t("items.maintenance.title"),
            description: t("items.maintenance.description"),
        },
        {
            icon: <FaClock className={styles.icon} />,
            title: t("items.flexibleRentals.title"),
            description: t("items.flexibleRentals.description"),
        },
    ];

    return (
        <section className={styles.services} id="services">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("heading")} />
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconContainer}>
                                {service.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
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
export default Services
