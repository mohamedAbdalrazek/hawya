// src/app/page.tsx
import React from "react";
import styles from "./Landing.module.css";
import Link from "next/link";
import LandingVideo from "./LandingVideo";

export default function Landing() {
    return (
        <section className={styles.hero}>
            <div className={styles.videoContainer}>
                <LandingVideo className={styles.video} />
                
                <div className={styles.videoOverlay} />
            </div>
            <div className={styles.heroContent}>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        Hawya, Reliable Car Rentals Across Saudi Arabia
                    </h1>
                    <p className={styles.subtitle}>
                        Explore our premium fleet of reliable, modern vehicles
                        perfect for every journey, from business to adventure.
                        Book with confidence, drive with ease.
                    </p>
                    <div className={styles.ctaGroup}>
                        <Link href="/cars" className={styles.primaryCta}>
                            Browse Our Fleet
                        </Link>
                        <Link href="/contact" className={styles.secondaryCta}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
