"use client";

import { Link } from "@/i18n/navigation";
import styles from "./NotFound.module.css";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations("notFound");

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.errorCode}>404</div>
                <h1 className={styles.title}>{t("title")}</h1>
                <p className={styles.description}>{t("description")}</p>
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeButton}>
                        {t("home")}
                    </Link>
                    <Link href="/contact" className={styles.contactButton}>
                        {t("contact")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
