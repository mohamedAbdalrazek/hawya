import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import AddStaffForm from "@/components/admin/add-staff/AddStaffForm";
import styles from "./AddStaffPage.module.css";
import { useTranslations } from "next-intl";

export default function AddStaffPage() {
    const t = useTranslations("Admin");

    return (
        <div className={styles.addStaffContainer}>
            <div className={styles.header}>
                <Link href="/dashboard/admin/staff" className={styles.backLink}>
                    <FaArrowLeft /> {t("AddStaffPage.back")}
                </Link>
                <h1>{t("AddStaffPage.title")}</h1>
            </div>

            <AddStaffForm />
        </div>
    );
}
