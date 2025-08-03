// app/dashboard/admin/staff/page.tsx
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import StaffTable from "@/components/admin/staff/StaffTable";
import styles from "./StaffPage.module.css";
import { useTranslations } from "next-intl";

export default function StaffPage() {
    const t = useTranslations("Admin");

    return (
        <div className={styles.staffContainer}>
            <div className={styles.staffHeader}>
                <h1>{t("StaffPage.title")}</h1>
                <Link
                    href="/dashboard/admin/staff/add"
                    className={styles.addStaffBtn}
                >
                    <FaPlus /> {t("StaffPage.addButton")}
                </Link>
            </div>

            <StaffTable />
        </div>
    );
}
