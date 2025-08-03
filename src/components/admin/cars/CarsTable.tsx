"use client";

import styles from "./CarsTable.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { CarMap } from "@/utils/types";
import { Link } from "@/i18n/navigation";
import Modal from "@/components/global/modal/Modal";
import nookies from "nookies";
import toast from "react-hot-toast";
import NoCarsFound from "@/components/global/no-car-found/NoCarsFound";
import { useLocale, useTranslations } from "next-intl";

export default function CarsTable({ cars }: { cars: CarMap[] }) {
    const t = useTranslations("Admin");
    const locale = useLocale()

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState<CarMap | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!selectedCar) return;
        try {
            setDeleting(true);
            const cookies = nookies.get();
            const session = cookies["session"];
            if (!session) {
                toast.error(t("CarsPage.CarsTable.unauthorized"));
                return;
            }

            Object.values(selectedCar.images).forEach((imageArray) => {
                imageArray.forEach(async (image) => {
                    try {
                        await fetch(`/api/admin/delete-image?imageId=${image.imageId}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${session}` },
                        });
                    } catch (err) {
                        console.error(err);
                    }
                });
            });

            const res = await fetch(`/api/admin/deleteCar?carId=${selectedCar.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
            });

            await res.json();

            if (!res.ok) {
                toast.error(t("CarsPage.CarsTable.deleteFailed"));
            } else {
                toast.success(t("CarsPage.CarsTable.deleteSuccess"));
                window.location.reload();
            }
        } catch {
            toast.error(t("CarsPage.CarsTable.deleteError"));
        } finally {
            setShowDeleteModal(false);
            setDeleting(false);
        }
    };

    return (
        <>
            <div className={styles.tableContainer}>
                <table className={`${styles.carsTable} ${locale === "ar" ? styles.arCarsTable : ""}`}>
                    <thead>
                        <tr>
                            <th>{t("CarsPage.CarsTable.model")}</th>
                            <th>{t("CarsPage.CarsTable.year")}</th>
                            <th>{t("CarsPage.CarsTable.type")}</th>
                            <th>{t("CarsPage.CarsTable.colors")}</th>
                            <th>{t("CarsPage.CarsTable.transmission")}</th>
                            <th>{t("CarsPage.CarsTable.pricing")}</th>
                            <th>{t("CarsPage.CarsTable.actions")}</th>
                        </tr>
                    </thead>
                    {!cars?.length ? (
                        <tbody>
                            <tr>
                                <td colSpan={7}><NoCarsFound /></td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.id}>
                                    <td>
                                        <div className={styles.modelCell}>
                                            <div className={styles.modelName}>{car.model}</div>
                                        </div>
                                    </td>
                                    <td>{car.year}</td>
                                    <td><span className={styles.typeBadge}>{car.type}</span></td>
                                    <td>
                                        <div className={styles.colorsContainer}>
                                            {car.availableColors.map((color) => (
                                                <span
                                                    key={color}
                                                    className={styles.colorChip}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td>{car.transmission}</td>
                                    <td>
                                        <div className={styles.pricing}>
                                            <div>{t("CarsPage.CarsTable.pricePerDay", { price: car.priceDay })}</div>
                                            <div>{t("CarsPage.CarsTable.pricePerMonth", { price: car.priceMonth })}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/dashboard/admin/cars/${car.id}`} className={styles.editBtn}>
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedCar(car);
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
                title={t("CarsPage.CarsTable.confirmDelete")}
            >
                <p>{t("CarsPage.CarsTable.confirmDeleteMsg", { model: selectedCar?.model||"", year: selectedCar?.year||0 })}</p>
                <div className={styles.modalActions}>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className={styles.cancelBtn}
                        disabled={deleting}
                    >
                        {deleting ? t("CarsPage.CarsTable.deleting") : t("CarsPage.CarsTable.cancel")}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={styles.confirmDeleteBtn}
                        disabled={deleting}
                    >
                        {deleting ? t("CarsPage.CarsTable.deleting") : t("CarsPage.CarsTable.delete")}
                    </button>
                </div>
            </Modal>
        </>
    );
}
