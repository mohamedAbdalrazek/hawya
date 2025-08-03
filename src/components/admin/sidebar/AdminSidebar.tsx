"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaCalendarAlt,
    FaCar,
    FaEnvelope,
    // FaCog,
    FaSignOutAlt,
    // FaHome,
    // FaChartLine,
    FaUser,
} from "react-icons/fa";
import styles from "./AdminSidebar.module.css";
import { useTranslations } from "next-intl";
import { auth } from "@/sdk/firebase";
import { signOut } from "firebase/auth";
import nookies from "nookies";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { validateSession } from "@/utils/functions";
export default function AdminSidebar() {
    const pathname = usePathname();
    const t = useTranslations("Admin");
    const router = useRouter();
    const [role, setRole] = useState<string| null>(null);
    const handleSignOut = async () => {
        try {
            await signOut(auth); // Firebase sign out

            // Clear the session cookie
            nookies.destroy(null, "session", { path: "/" });

            // Redirect to home page
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    const navItems = [
        // { href: "/dashboard/admin", icon: <FaHome />, label: t("Sidebar.dashboard") },

        {
            href: "/dashboard/admin/bookings",
            icon: <FaCalendarAlt />,
            label: t("Sidebar.bookings"),
        },
        {
            href: "/dashboard/admin/cars",
            icon: <FaCar />,
            label: t("Sidebar.cars"),
        },
        {
            href: "/dashboard/admin/messages",
            icon: <FaEnvelope />,
            label: t("Sidebar.messages"),
        },
    ];
    const adminNavItems = [
        {
            href: "/dashboard/admin/staff",
            icon: <FaUser />,
            label: t("Sidebar.staff"),
        },
        ...navItems,
    ];
    useEffect(() => {
        const getRole = async () => {
            const session = nookies.get().session;
            const role = await validateSession(session);
            if (role) {
                setRole(role);
            }
        };
        getRole();
    },[]);
    const navItemsToRender = role === "admin" ? adminNavItems : navItems;
    return (
        <aside className={styles.adminSidebar}>
            <div className={styles.sidebarHeader}>
                <h2>{t("Sidebar.header")}</h2>
            </div>

            <nav className={styles.sidebarNav}>
                <ul>
                    {navItemsToRender.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`${styles.navLink} ${
                                    pathname.includes(item.href)? styles.active : ""
                                }`}
                            >
                                <span className={styles.navIcon}>
                                    {item.icon}
                                </span>
                                <span className={styles.navLabel}>
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <form
                className={styles.sidebarFooter}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignOut();
                }}
            >
                <button type="submit" className={styles.logoutButton}>
                    <FaSignOutAlt className={styles.logoutIcon} />
                    <span>{t("Sidebar.logout")}</span>
                </button>
            </form>
        </aside>
    );
}
