"use client";
import React from "react";
import styles from "./Locations.module.css";
import { FaMapMarkerAlt, FaPhone, FaClock, FaCar } from "react-icons/fa";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { useTranslations } from "next-intl";
import { useLocations } from "@/utils/info";
// app/(your-locale)/locations/page.tsx



const Locations = () => {
    const t = useTranslations("Locations");
    const locations = useLocations();
    return (
        <section className={styles.locations} id="locations">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("heading")} />
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <div className={styles.grid}>
                    {locations.map((location, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.mapContainer}>
                                <iframe
                                    className={styles.map}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`}
                                ></iframe>
                            </div>

                            <div className={styles.content}>
                                <div className={styles.city}>
                                    <FaMapMarkerAlt className={styles.icon} />
                                    <h3>{location.city}</h3>
                                </div>

                                <div className={styles.info}>
                                    <p className={styles.address}>
                                        <strong>{t("addressLabel")}</strong>{" "}
                                        {location.address}
                                    </p>

                                    <div className={styles.details}>
                                        <div className={styles.detailItem}>
                                            <FaPhone
                                                className={styles.detailIcon}
                                            />
                                            <span>{location.phone}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <FaClock
                                                className={styles.detailIcon}
                                            />
                                            <span>{location.hours}</span>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.directionsButton}
                                >
                                    <FaCar className={styles.buttonIcon} />
                                    {t("getDirections")}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Locations;
