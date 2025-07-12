"use client";
import Link from "next/link";
import styles from "./Nav.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/utils/info";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const Nav = () => {
    const pathname = usePathname()
    const [openMenu, setOpenMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isNotHome, setIsNotHome] = useState(pathname !== "/" && pathname !== "/about");
    useEffect(() => {
        setIsNotHome(pathname !== "/" && pathname !== "/about");
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
    }, [scrolled, pathname]);
    return (
        <header
            className={`${styles.navbar} ${isNotHome ? styles.notHome : ""} ${scrolled ? styles.scrolled : ""} `}
        >
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-white.png"
                        alt="DriveEasy Rentals Logo"
                        width={60}
                        height={60}
                        priority
                    />
                </Link>

                <nav className={styles.nav}>
                    <ul className={`${styles.navList} ${openMenu ? styles.open : ""}`}>
                        {navLinks.map((link) => (
                            <li key={link.path} className={`${styles.navItem} `}>
                                <Link
                                    href={link.path}
                                    className={styles.navLink}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <Link href="/cars" className={`${styles.ctaButton} ${styles.menuButton}`}>
                            Book Now
                        </Link>
                        <FaXmark className={styles.closeMenu} onClick={()=>setOpenMenu(false)}  />
                    </ul>
                <FaBars onClick={()=>setOpenMenu(true)} className={styles.menuToggle} />
                </nav>

                <div className={styles.ctaContainer}>
                    <Link href="/cars" className={styles.ctaButton}>
                        Book Now
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Nav;
