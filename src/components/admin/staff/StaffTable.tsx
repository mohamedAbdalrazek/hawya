"use client";

import styles from "./StaffTable.module.css";
import { FaTrash } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { StaffMap } from "@/utils/types";
import Modal from "@/components/global/modal/Modal";
import nookies from "nookies";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";

export default function StaffTable() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMap | null>(null);
    const [loading, setLoading] = useState(true);
    const [staffMembers, setStaffMembers] = useState<StaffMap[] | null>(null);
    const [deleting, setDeleting] = useState(false);

    const t = useTranslations("Admin");
    const locale = useLocale();

    const fetchStaff = useCallback(
        async function (): Promise<void> {
            try {
                setLoading(true);
                const cookies = nookies.get();
                const session = cookies["session"];
                if (!session) {
                    toast.error(t("StaffPage.notAuthorized"));
                    return;
                }
                const response = await fetch(`/api/admin/getStaff`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStaffMembers(data.staff);
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [t]
    );
    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);
    const handleDelete = async () => {
        if (!selectedStaff) return;

        try {
            setDeleting(true);
            const cookies = nookies.get();
            const session = cookies["session"];

            if (!session) {
                toast.error(t("StaffPage.notAuthorized"));
                return;
            }

            const res = await fetch(
                `/api/admin/delete-staff?name=${encodeURIComponent(
                    selectedStaff.name
                )}&email=${encodeURIComponent(selectedStaff.email)}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                }
            );

            await res.json();

            if (!res.ok) {
                toast.error(t("StaffPage.deleteFailed"));
            } else {
                toast.success(t("StaffPage.deleteSuccess"));
                window.location.reload();
            }
        } catch {
            toast.error(t("StaffPage.deleteError"));
        } finally {
            setShowDeleteModal(false);
            setDeleting(false);
        }
    };
    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <SpinLoader size="lg" />
            </div>
        );
    }
    if (!staffMembers) {
        return <div>{t("StaffPage.noUsers")}</div>;
    }

    return (
        <>
            <div className={styles.tableContainer}>
                <table
                    className={`${styles.staffTable} ${
                        locale === "ar" ? styles.arStaffTable : ""
                    }`}
                >
                    <thead>
                        <tr>
                            <th>{t("StaffPage.name")}</th>
                            <th>{t("StaffPage.email")}</th>
                            <th>{t("StaffPage.role")}</th>
                            <th>{t("StaffPage.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffMembers.map((staff) => (
                            <tr key={staff.name}>
                                <td>{staff.name}</td>
                                <td>{staff.email}</td>
                                <td>
                                    <span
                                        className={`${styles.roleBadge} ${
                                            staff.role === "admin"
                                                ? styles.adminBadge
                                                : styles.staffBadge
                                        }`}
                                    >
                                        {t(`StaffPage.${staff.role}`)}
                                    </span>
                                </td>
                                {staff.role !== "admin" && (
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => {
                                                    setSelectedStaff(staff);
                                                    setShowDeleteModal(true);
                                                }}
                                                className={styles.deleteBtn}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={t("StaffPage.confirmDeleteTitle")}
            >
                <p>
                    {t("StaffPage.confirmDeleteText", {
                        name: selectedStaff?.name || "",
                    })}
                </p>
                <div className={styles.modalActions}>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className={styles.cancelBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("StaffPage.deleting")
                            : t("StaffPage.cancel")}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={styles.confirmDeleteBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("StaffPage.deleting")
                            : t("StaffPage.delete")}
                    </button>
                </div>
            </Modal>
        </>
    );
}
