// app/about/page.tsx
import React from "react";
import styles from "./AboutPage.module.css"; // Adjust the path as necessary
import Image from "next/image";
import Link from "next/link";
import { FaHandshake } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { HiLightBulb } from "react-icons/hi";
import HomeHeading from "@/components/global/home-heading/HomeHeading";

export default function AboutPage() {
    return (
        <main className={styles.pageContainer}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`${styles.heroContent}`}>
                    <h1 className={styles.heroTitle}>
                        Driving Excellence in Saudi Arabia
                    </h1>
                    <p className={styles.heroText}>
                        Hawya is revolutionizing car rentals with premium
                        vehicles, exceptional service, and a commitment to your
                        mobility needs across the Kingdom.
                    </p>
                    <Link
                        href="/cars"
                        className={`${styles.btn} ${styles.heroBtn}`}
                    >
                        Explore Our Fleet
                    </Link>
                </div>
                <div className={styles.heroImage}>
                    <Image
                        src="/about/hero-car.jpg" // Replace with your actual image path
                        alt="Luxury car from Hawya fleet parked in Saudi Arabia"
                        fill
                        className={styles.image}
                        priority
                    />
                </div>
            </section>

            {/* Our Story Section */}
            <section className={`${styles.section}`}>
                <div className={styles.sectionHeader}>
                    <HomeHeading text="Our Story" />
                </div>
                <div className={styles.storyContent}>
                    <div className={styles.storyText}>
                        <p>
                            Founded in 2020, Hawya began with a simple mission:
                            to provide Saudi residents and visitors with
                            reliable, high-quality vehicles and exceptional
                            service. What started as a small fleet of 10 cars
                            has now grown into one of the most trusted car
                            rental services in the Kingdom.
                        </p>
                        <p>
                            The name &quot;Hawya&quot; reflects our commitment
                            to helping you move freely and explore Saudi
                            Arabia&apos;s beautiful landscapes and vibrant
                            cities with comfort and confidence.
                        </p>
                    </div>
                    <div className={styles.storyImage}>
                        <Image
                            src="/about/company-story.jpg" // Replace with your actual image path
                            alt="Hawya team members with rental cars"
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
                        <HomeHeading text="Our Values" />
                    </div>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <FaHandshake className={styles.icon} />
                            </div>
                            <h3>Trust</h3>
                            <p>
                                We build relationships based on transparency and
                                reliability, ensuring you always get what you
                                expect.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <MdVerified className={styles.icon} />
                            </div>
                            <h3>Quality</h3>
                            <p>
                                From our vehicles to our customer service, we
                                maintain the highest standards in everything we
                                do.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <HiLightBulb className={styles.icon} />
                            </div>
                            <h3>Innovation</h3>
                            <p>
                                We continuously improve our services and embrace
                                technology to enhance your rental experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fleet Advantage Section */}
            <section className={`container ${styles.section}`}>
                <div className={styles.sectionHeader}>
                    <HomeHeading text="Why Choose Hawya?" />
                </div>
                <div className={styles.advantageGrid}>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>01</div>
                        <h3>Premium Fleet</h3>
                        <p>
                            We carefully maintain our vehicles to ensure they
                            meet the highest standards of performance, safety,
                            and comfort.
                        </p>
                    </div>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>02</div>
                        <h3>Flexible Rental Options</h3>
                        <p>
                            Whether you need a car for a day, a week, or longer,
                            we offer competitive rates and flexible terms.
                        </p>
                    </div>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>03</div>
                        <h3>24/7 Support</h3>
                        <p>
                            Our dedicated support team is available around the
                            clock to assist you with any questions or
                            emergencies.
                        </p>
                    </div>
                    <div className={styles.advantageCard}>
                        <div className={styles.advantageNumber}>04</div>
                        <h3>Nationwide Coverage</h3>
                        <p>
                            With locations across major Saudi cities, we make it
                            easy to rent and return vehicles wherever your
                            journey takes you.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`${styles.ctaSection} ${styles.section}`}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>
                        Ready for Your Next Adventure?
                    </h2>
                    <p className={styles.ctaText}>
                        Experience the Hawya difference with our premium fleet
                        and exceptional service.
                    </p>
                    <div className={styles.ctaButtons}>
                        <Link
                            href="/cars"
                            className={`${styles.btn} ${styles.primaryBtn}`}
                        >
                            Browse Vehicles
                        </Link>
                        <Link
                            href="/contact"
                            className={`${styles.btn} ${styles.secondaryBtn}`}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
