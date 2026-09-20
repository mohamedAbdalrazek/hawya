"use client";

import styles from "./LocationsTable.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { LocationMap } from "@/utils/types";
import { Link } from "@/i18n/navigation";
import Modal from "@/components/global/modal/Modal";
import nookies from "nookies";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { formatHours } from "@/utils/locationHours";

export default function LocationsTable({
    locations,
}: {
    locations: LocationMap[];
}) {
    const t = useTranslations("Admin");
    const locale = useLocale();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLocation, setSelectedLocation] =
        useState<LocationMap | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!selectedLocation) return;
        try {
            setDeleting(true);
            const cookies = nookies.get();
            const session = cookies["session"];
            if (!session) {
                toast.error(t("LocationsPage.Table.unauthorized"));
                return;
            }

            const res = await fetch(
                `/api/admin/delete-location?locationId=${selectedLocation.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                }
            );

            if (!res.ok) {
                toast.error(t("LocationsPage.Table.deleteFailed"));
            } else {
                toast.success(t("LocationsPage.Table.deleteSuccess"));
                window.location.reload();
            }
        } catch {
            toast.error(t("LocationsPage.Table.deleteError"));
        } finally {
            setShowDeleteModal(false);
            setDeleting(false);
        }
    };

    const displayName = (location: LocationMap) =>
        locale.startsWith("ar")
            ? location.name.ar || location.name.en
            : location.name.en || location.name.ar;

    return (
        <>
            <div className={styles.tableContainer}>
                <table
                    className={`${styles.locationsTable} ${
                        locale === "ar" ? styles.arLocationsTable : ""
                    }`}
                >
                    <thead>
                        <tr>
                            <th>{t("LocationsPage.Table.name")}</th>
                            <th>{t("LocationsPage.Table.phone")}</th>
                            <th>{t("LocationsPage.Table.hours")}</th>
                            <th>{t("LocationsPage.Table.sortOrder")}</th>
                            <th>{t("LocationsPage.Table.actions")}</th>
                        </tr>
                    </thead>
                    {!locations?.length ? (
                        <tbody>
                            <tr>
                                <td colSpan={5} className={styles.empty}>
                                    {t("LocationsPage.empty")}
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {locations.map((location) => (
                                <tr key={location.id}>
                                    <td>
                                        <div className={styles.nameCell}>
                                            {displayName(location)}
                                        </div>
                                    </td>
                                    <td>{location.phone}</td>
                                    <td className={styles.hoursCell}>
                                        {formatHours(location.hours, locale)}
                                    </td>
                                    <td>{location.sortOrder}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link
                                                href={`/dashboard/admin/locations/${location.id}`}
                                                className={styles.editBtn}
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedLocation(
                                                        location
                                                    );
                                                    setShowDeleteModal(true);
                                                }}
                                                className={styles.deleteBtn}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={t("LocationsPage.Table.confirmDelete")}
            >
                <p>
                    {t("LocationsPage.Table.confirmDeleteMsg", {
                        name: selectedLocation
                            ? displayName(selectedLocation)
                            : "",
                    })}
                </p>
                <div className={styles.modalActions}>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className={styles.cancelBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("LocationsPage.Table.deleting")
                            : t("LocationsPage.Table.cancel")}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={styles.confirmDeleteBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("LocationsPage.Table.deleting")
                            : t("LocationsPage.Table.delete")}
                    </button>
                </div>
            </Modal>
        </>
    );
}
