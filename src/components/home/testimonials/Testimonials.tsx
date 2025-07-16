// src/components/Testimonials/Testimonials.tsx
import React from "react";
import styles from "./Testimonials.module.css";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { useLocale, useTranslations } from "next-intl";

const Testimonials = () => {
    const t = useTranslations("Testimonials");
    const locale = useLocale()
    return (
        <section className={styles.testimonials} id="testimonials">
            <div className={`${styles.container} container`}>
                <div className={styles.header}>
                    <HomeHeading text={t("heading")} />
                    <p className={styles.subtitle}>
                        {t("subtitle")}
                    </p>
                </div>

                <div className={styles.grid}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className={styles.card}>
                            <div className={`${styles.quoteIcon} ${locale==="ar"&& styles.arabicQuoteIcon}`}>
                                <FaQuoteLeft />
                            </div>
                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < 5
                                                ? styles.starFilled
                                                : styles.starEmpty
                                        }
                                    />
                                ))}
                            </div>
                            <p className={styles.content}>
                                {t(`list.${index}.content`)}
                            </p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>
                                    <span>
                                        {t(
                                            `list.${index}.name`
                                        )[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className={styles.authorInfo}>
                                    <h4 className={styles.name}>
                                        {t(`list.${index}.name`)}
                                    </h4>
                                    <p className={styles.role}>
                                        {t(`list.${index}.role`)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
