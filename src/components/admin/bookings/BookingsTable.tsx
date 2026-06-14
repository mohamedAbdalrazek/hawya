"use client";

import { FaTrash } from "react-icons/fa";
import styles from "./BookingsTable.module.css";
import { BookingFormData } from "@/utils/types";
import nookies from "nookies";
import toast from "react-hot-toast";
import Modal from "@/components/global/modal/Modal";
import { useState } from "react";
import { useTranslations } from "next-intl";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";

export default function BookingsTable({
    bookings,
    handleLoadMore,
    hasMore,
}: {
    bookings: BookingFormData[];
    hasMore: boolean;
    handleLoadMore: () => void;
}) {
    const t = useTranslations("Admin");
    const tc = useTranslations("carColors");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedBooking, setSelectedBooking] =
        useState<BookingFormData | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const calculateEndDate = (
        startDate: string,
        period: number,
        rentalType: "daily" | "monthly"
    ) => {
        const date = new Date(startDate);
        if (rentalType === "daily") {
            date.setDate(date.getDate() + period);
        } else {
            date.setMonth(date.getMonth() + period);
        }
        return formatDate(date.toString());
    };

    console.log(calculateEndDate("16 mars 2026", 2, "monthly"))
    const handleDelete = async () => {
        if (!selectedBooking) return;

        try {
            setDeleting(true);
            const cookies = nookies.get();
            const session = cookies["session"];

            if (!session) {
                toast.error(
                    t("BookingsPage.BookingsTable.errors.unauthorized")
                );
                return;
            }

            const res = await fetch(
                `/api/admin/delete-booking?bookingId=${selectedBooking.id}`,
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
                toast.error(t("BookingsPage.BookingsTable.errors.failed"));
            } else {
                toast.success(t("BookingsPage.BookingsTable.success.deleted"));
                window.location.reload();
            }
        } catch {
            toast.error(t("BookingsPage.BookingsTable.errors.generic"));
        } finally {
            setShowDeleteModal(false);
            setDeleting(false);
        }
    };

    return (
        <div className={styles.tableContainer}>
            {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>{t("BookingsPage.BookingsTable.empty")}</p>
                </div>
            ) : (
                <div className={styles.bookingsTableGrid}>
                    
                    <InfiniteScroll
                        dataLength={bookings.length}
                        next={handleLoadMore}
                        hasMore={hasMore}
                        loader={<div
                            style={{marginBottom: "20px", marginTop: "20px"}}
                        ><SpinLoader size="sm" /></div>}
                        className={styles.scrollBody}
                    >
                        <div className={`${styles.headerRow} ${styles.row}`}>
                        <div className={styles.col}>
                            {t("BookingsPage.BookingsTable.headers.customer")}
                        </div>
                        <div className={styles.col}>
                            {t("BookingsPage.BookingsTable.headers.vehicle")}
                        </div>
                        <div className={styles.col}>
                            {t("BookingsPage.BookingsTable.headers.period")}
                        </div>
                        <div className={styles.col}>
                            {t("BookingsPage.BookingsTable.headers.dates")}
                        </div>
                        <div className={styles.col}>
                            {t("BookingsPage.BookingsTable.headers.actions")}
                        </div>
                    </div>
                        {bookings.map((booking) => (
                            <div key={booking.id} className={styles.row}>
                                <div className={styles.col}>
                                    <div className={styles.customerCell}>
                                        <div className={styles.customerName}>
                                            {booking.name}
                                        </div>
                                        <div className={styles.customerContact}>
                                            {booking.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.vehicleCell}>
                                        <div className={styles.vehicleModel}>
                                            {booking.model} ({booking.year})
                                        </div>
                                        <div className={styles.vehicleColor}>
                                            {tc(booking.color)}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    {booking.period}{" "}
                                    {booking.rentalType === "daily"
                                        ? t(
                                              "BookingsPage.BookingsTable.rental.daily"
                                          )
                                        : t(
                                              "BookingsPage.BookingsTable.rental.monthly"
                                          )}
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.dateCell}>
                                        <div>
                                            {formatDate(booking.startDate)}
                                        </div>
                                        {/* <div className={styles.dateSeparator}>
                                            →
                                        </div> */}
                                        <div>
                                            {calculateEndDate(
                                                booking.startDate,
                                                booking.period,
                                                booking.rentalType
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setShowDeleteModal(true);
                                            }}
                                            aria-label={t(
                                                "BookingsPage.BookingsTable.aria.delete"
                                            )}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            )}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={t("BookingsPage.BookingsTable.modal.title")}
            >
                <p className={styles.confirmText}>
                    {t("BookingsPage.BookingsTable.modal.text", {
                        model: selectedBooking?.model || "",
                        year: selectedBooking?.year || "",
                        date: selectedBooking?.startDate || "",
                    })}
                </p>
                <div className={styles.modalActions}>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className={styles.cancelBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("BookingsPage.BookingsTable.modal.deleting")
                            : t("BookingsPage.BookingsTable.modal.cancel")}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={styles.confirmDeleteBtn}
                        disabled={deleting}
                    >
                        {deleting
                            ? t("BookingsPage.BookingsTable.modal.deleting")
                            : t("BookingsPage.BookingsTable.modal.confirm")}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
