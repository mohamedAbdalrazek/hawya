// src/app/page.tsx
import React from "react";
import styles from "./Landing.module.css";
import Link from "next/link";

export default function Landing() {
    return (
        <section className={styles.hero}>
            {/* Video Background */}
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline className={styles.video}>
                    <source src="/landing-video-hd.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className={styles.videoOverlay} />
            </div>

            {/* Hero Content */}
            <div className={styles.heroContent}>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        Hawya ,Reliable Car Rentals Across Saudi Arabia
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
