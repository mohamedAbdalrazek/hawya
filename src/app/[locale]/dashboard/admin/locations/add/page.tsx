"use client";

import { FaArrowLeft } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import LocationForm from "@/components/admin/locations/LocationForm";
import styles from "./AddLocationPage.module.css";
import { useTranslations } from "next-intl";

export default function AddLocationPage() {
    const t = useTranslations("Admin");

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link
                    href="/dashboard/admin/locations"
                    className={styles.backLink}
                >
                    <FaArrowLeft /> {t("LocationsPage.Form.back")}
                </Link>
                <h1>{t("LocationsPage.Form.addTitle")}</h1>
            </div>
            <LocationForm mode="add" />
        </div>
    );
}
