// src/components/Footer/Footer.tsx
"use client";
import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";
import { locations, navLinks } from "@/utils/info";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.container} container`}>
                {/* Top Section */}
                <div className={styles.topSection}>
                    <div className={styles.brandInfo}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo-white.png"
                                alt="Hawya Car Rental Logo"
                                width={80}
                                height={80}
                            />
                            <span className={styles.logoText}>
                                Hawya Car Rental
                            </span>
                        </Link>
                        <p className={styles.tagline}>
                            Premium car rental services across Saudi Arabia
                        </p>

                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Facebook">
                                <FaFacebook className={styles.socialIcon} />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <FaTwitter className={styles.socialIcon} />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <FaInstagram className={styles.socialIcon} />
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <FaLinkedin className={styles.socialIcon} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.contactInfo}>
                        <h3 className={styles.sectionTitle}>Contact Us</h3>
                        <ul className={styles.contactList}>
                            <li>
                                <FaPhone className={styles.contactIcon} />
                                <a href="tel:+966561741202">+966 56 174 1202</a>
                            </li>
                            <li>
                                <FaEnvelope className={styles.contactIcon} />
                                <a href="mailto:info@hawyarental.com">
                                    info@hawyarental.com
                                </a>
                            </li>
                            <li>
                                <FaMapMarkerAlt
                                    className={styles.contactIcon}
                                />
                                <span>
                                    King Fahd Road, Al Shati District, Dammam
                                </span>
                            </li>
                            <li>
                                <FaClock className={styles.contactIcon} />
                                <div>
                                    <p>Sunday - Thursday: 8:00 AM - 8:00 PM</p>
                                    <p>Friday - Saturday: 10:00 AM - 6:00 PM</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.locations}>
                        <h3 className={styles.sectionTitle}>Our Locations</h3>
                        <div className={styles.locationGrid}>
                            {locations.map((location, index) => (
                                <div
                                    key={index}
                                    className={styles.locationCard}
                                >
                                    <h4 className={styles.locationCity}>
                                        {location.city}
                                    </h4>
                                    <p className={styles.locationAddress}>
                                        {location.address}
                                    </p>
                                    <a
                                        href={`tel:${location.phone}`}
                                        className={styles.locationPhone}
                                    >
                                        {location.phone}
                                    </a>
                                    <p className={styles.locationHours}>
                                        {location.hours}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <nav className={styles.footerNav}>
                        <ul className={styles.footerNavList}>
                            {navLinks.map((link) => (
                                <li
                                    key={link.path}
                                    className={styles.footerNavItem}
                                >
                                    <Link
                                        href={link.path}
                                        className={styles.footerNavLink}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.legal}>
                        <p>
                            &copy; {new Date().getFullYear()} Hawya Car Rental.
                            All rights reserved.
                        </p>
                        <div className={styles.legalLinks}>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <Link href="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
