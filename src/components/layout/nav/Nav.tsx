"use client";
import Link from "next/link";
import styles from "./Nav.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/utils/info";

const Nav = () => {
    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);
    return (
        <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} >
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-white.png"
                        alt="DriveEasy Rentals Logo"
                        width={60}
                        height={60}
                        priority
                    />
                    {/* <span>

                    Hawya Car Rental
                    </span> */}
                </Link>

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {navLinks.map((link) => (
                            <li key={link.path} className={styles.navItem}>
                                <Link
                                    href={link.path}
                                    className={styles.navLink}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.ctaContainer}>
                    <Link href="/book-now" className={styles.ctaButton}>
                        Book Now
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Nav;
