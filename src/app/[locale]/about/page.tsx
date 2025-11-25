import React from "react";
import styles from "./AboutPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaHandshake } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { HiLightBulb } from "react-icons/hi";
import HomeHeading from "@/components/global/home-heading/HomeHeading";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        title: t("about.title"),
        description: t("about.description"),
        keywords: t("about.keywords")
            .split(",")
            .map((kw) => kw.trim()),
        openGraph: {
            title: t("about.ogTitle"),
            description: t("about.ogDescription"),
            url: "https://www.marakeb.co/about",
            siteName: "Marakeb",
            type: "website",
            images: [
                {
                    url: "https://www.marakeb.co/og/home.jpg",
                    width: 1200,
                    height: 630,
                    alt: t("about.ogAlt"),
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("about.twitterTitle"),
            description: t("about.twitterDescription"),
            images: ["https://www.marakeb.co/og/home.jpg"],
        },
        alternates: {
            canonical: "https://www.marakeb.co/about",
            languages: {
                en: "https://www.marakeb.co/en/about",
                ar: "https://www.marakeb.co/ar/about",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
export default function AboutPage() {
    const t = useTranslations("About");
    const locale = useLocale();

    return (
        <main className={styles.pageContainer}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{t("heroTitle")}</h1>
                    <p className={styles.heroText}>{t("heroText")}</p>
                    <Link
                        href="/cars"
                        className={`${styles.btn} ${styles.heroBtn}`}
                    >
                        {t("heroButton")}
                    </Link>
                </div>
                <div className={styles.heroImage}>
                    <Image
                        src="/about/hero-car.jpg"
                        alt={t("heroImageAlt")}
                        fill
                        className={styles.image}
                        priority
                    />
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <HomeHeading text={t("storyTitle")} />
                </div>
                <div
                    className={`${styles.storyContent} ${
                        locale === "ar" ? styles.arStoryContent : ""
                    }`}
                >
                    <div className={styles.storyText}>
                        <p>{t("storyParagraph1")}</p>
                        <p>{t("storyParagraph2")}</p>
                    </div>
                    <div className={styles.storyImage}>
                        <Image
                            src="/about/company-story.jpg"
                            alt={t("storyImageAlt")}
                            fill
                            className={styles.image}
                        />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={`${styles.valuesSection} ${styles.section}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <HomeHeading text={t("valuesTitle")} />
                    </div>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <FaHandshake className={styles.icon} />
                            </div>
                            <h3>{t("value1Title")}</h3>
                            <p>{t("value1Text")}</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <MdVerified className={styles.icon} />
                            </div>
                            <h3>{t("value2Title")}</h3>
                            <p>{t("value2Text")}</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <HiLightBulb className={styles.icon} />
                            </div>
                            <h3>{t("value3Title")}</h3>
                            <p>{t("value3Text")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fleet Advantage */}
            <section className={`container ${styles.section}`}>
                <div className={styles.sectionHeader}>
                    <HomeHeading text={t("whyChooseTitle")} />
                </div>
                <div className={styles.advantageGrid}>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>01</div>
                        <h3>{t("advantage1Title")}</h3>
                        <p>{t("advantage1Text")}</p>
                    </div>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>02</div>
                        <h3>{t("advantage2Title")}</h3>
                        <p>{t("advantage2Text")}</p>
                    </div>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>03</div>
                        <h3>{t("advantage3Title")}</h3>
                        <p>{t("advantage3Text")}</p>
                    </div>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>04</div>
                        <h3>{t("advantage4Title")}</h3>
                        <p>{t("advantage4Text")}</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={`${styles.ctaSection} ${styles.section}`}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>{t("ctaTitle")}</h2>
                    <p className={styles.ctaText}>{t("ctaText")}</p>
                    <div className={styles.ctaButtons}>
                        <Link
                            href="/cars"
                            className={`${styles.btn} ${styles.primaryBtn}`}
                        >
                            {t("ctaPrimaryBtn")}
                        </Link>
                        <Link
                            href="/contact"
                            className={`${styles.btn} ${styles.secondaryBtn}`}
                        >
                            {t("ctaSecondaryBtn")}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
