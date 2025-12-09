"use client";
import React from "react";
import styles from "./Landing.module.css";
import { Link } from "@/i18n/navigation";
import LandingVideo from "./LandingVideo";
import { useTranslations } from "next-intl";

export default function Landing() {
    const t = useTranslations("Landing");

    return (
        <section className={styles.hero}>
            <div className={styles.videoContainer}>
                <LandingVideo className={styles.video} />
                <div className={styles.videoOverlay} />
            </div>
            <div className={styles.heroContent}>
                <div className={styles.container}>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                    <div className={styles.ctaGroup}>
                        <Link href="/cars" className={styles.primaryCta}>
                            {t("browseFleet")}
                        </Link>
                        <Link href="/contact" className={styles.secondaryCta}>
                            {t("contactUs")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
