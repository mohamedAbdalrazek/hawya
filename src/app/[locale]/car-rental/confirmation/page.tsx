"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import styles from "./ConfirmationPage.module.css";
import { BookingFormData, ClientCarMap } from "@/utils/types";
import { FaCheck } from "react-icons/fa";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import { useRouter } from "@/i18n/navigation";

export default function ConfirmationPage() {
    const t = useTranslations();
    const router = useRouter();
    const [bookingData, setBookingData] = useState<BookingFormData | null>(
        null
    );
    const [selectedCar, setSelectedCar] = useState<ClientCarMap | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem("bookingData");
        if (!storedData) {
            setLoading(false); // prevent infinite loading when no data
            return;
        }
        const data = JSON.parse(storedData) as BookingFormData;
        setBookingData(data);

        const fetchCar = async () => {
            setLoading(true); // Start loading before the fetch
            try {
                const response = await fetch(
                    `/api/getCars?carId=${data.carId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    const car = data.car;
                    setSelectedCar(car);
                } else {
                    throw new Error("Failed to fetch car");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Only stop loading after fetch completes or fails
            }
        };

        fetchCar();
    }, []);

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <SpinLoader size="lg" />
            </div>
        );
    }

    if (!bookingData || !selectedCar) {
        return (
            <div className={styles.errorContainer}>
                <h2>{t("ConfirmationPage.noBookingData")}</h2>
                <button
                    className={"btn btn-primary"}
                    onClick={() => router.push("/car-rental")}
                >
                    {t("ConfirmationPage.backToHome")}
                </button>
            </div>
        );
    }

    const calculateEndDate = () => {
        const startDate = new Date(bookingData.startDate);
        const endDate = new Date(startDate);

        if (bookingData.rentalType === "daily") {
            endDate.setDate(startDate.getDate() + bookingData.period);
        } else {
            endDate.setMonth(startDate.getMonth() + bookingData.period);
        }

        return endDate.toLocaleDateString();
    };

    const calculateTotalPrice = () => {
        return bookingData.rentalType === "daily"
            ? selectedCar.priceDay * bookingData.period
            : selectedCar.priceMonth * bookingData.period;
    };

    return (
        <div className={styles.container}>
            {/* Success Header */}
            <div className={styles.successHeader}>
                <div className={styles.checkmarkCircle}>
                    <FaCheck className={styles.checkmarkIcon} />
                </div>
                <h1 className={styles.title}>{t("ConfirmationPage.title")}</h1>
                <p className={styles.subtitle}>
                    {t("ConfirmationPage.subtitle")}
                </p>
            </div>

            {/* Booking Summary */}
            <div className={styles.summaryContainer}>
                <h2 className={styles.summaryTitle}>
                    {t("ConfirmationPage.bookingSummary")}
                </h2>

                <div className={styles.gridLayout}>
                    {/* Car Details */}
                    <div className={styles.carDetails}>
                        <h3 className={styles.sectionTitle}>
                            {t("ConfirmationPage.carDetails")}
                        </h3>
                        <div className={styles.carImageContainer}>
                            {selectedCar.images[bookingData.color]?.length >
                            0 ? (
                                <Image
                                    src={
                                        selectedCar.images[bookingData.color][0]
                                    }
                                    alt={`${selectedCar.model} ${bookingData.color}`}
                                    width={400}
                                    height={300}
                                    className={styles.carImage}
                                />
                            ) : (
                                <Image
                                    src="/cars/placeholder.jpg"
                                    alt={selectedCar.model}
                                    width={400}
                                    height={300}
                                    className={styles.carImage}
                                />
                            )}
                        </div>
                        <div className={styles.carInfo}>
                            <h4>
                                {selectedCar.model} ({selectedCar.year})
                            </h4>
                            <p>
                                <span className={styles.detailLabel}>
                                    {t("ConfirmationPage.color")}:{" "}
                                </span>
                                {t(`carColors.${bookingData.color}`)}
                            </p>
                            <p>
                                <span className={styles.detailLabel}>
                                    {t("ConfirmationPage.type")}:{" "}
                                </span>
                                {selectedCar.type}
                            </p>
                            <p>
                                <span className={styles.detailLabel}>
                                    {t("ConfirmationPage.transmission")}:{" "}
                                </span>
                                {selectedCar.transmission}
                            </p>
                        </div>
                    </div>

                    {/* Rental Details */}
                    <div className={styles.rentalDetails}>
                        <h3 className={styles.sectionTitle}>
                            {t("ConfirmationPage.rentalDetails")}
                        </h3>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.rentalType")}:{" "}
                            </span>
                            <span>
                                {bookingData.rentalType === "daily"
                                    ? t("ConfirmationPage.daily")
                                    : t("ConfirmationPage.monthly")}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.period")}:{" "}
                            </span>
                            <span>
                                {bookingData.period}{" "}
                                {bookingData.rentalType === "daily"
                                    ? t("ConfirmationPage.days")
                                    : t("ConfirmationPage.months")}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.startDate")}:{" "}
                            </span>
                            <span>
                                {new Date(
                                    bookingData.startDate
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.endDate")}:{" "}
                            </span>
                            <span>{calculateEndDate()}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.rate")}:{" "}
                            </span>
                            <span>
                                {bookingData.rentalType === "daily"
                                    ? `${selectedCar.priceDay} ${t(
                                          "ConfirmationPage.sar"
                                      )}/${t("ConfirmationPage.day")}`
                                    : `${selectedCar.priceMonth} ${t(
                                          "ConfirmationPage.sar"
                                      )}/${t("ConfirmationPage.month")}`}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.totalPrice")}:{" "}
                            </span>
                            <span className={styles.totalPrice}>
                                {calculateTotalPrice()}{" "}
                                {t("ConfirmationPage.sar")}
                            </span>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className={styles.customerDetails}>
                        <h3 className={styles.sectionTitle}>
                            {t("ConfirmationPage.customerDetails")}
                        </h3>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.fullName")}:{" "}
                            </span>
                            <span>{bookingData.name}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.phoneNumber")}:{" "}
                            </span>
                            <span>{bookingData.phone}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.idNumber")}:{" "}
                            </span>
                            <span>{bookingData.idNumber}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                {t("ConfirmationPage.birthDate")}:{" "}
                            </span>
                            <span>
                                {new Date(
                                    bookingData.birthDate
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button
                    onClick={() => window.print()}
                    className={`btn btn-primary ${styles.printButton}`}
                >
                    {t("ConfirmationPage.printConfirmation")}
                </button>
                <button
                    onClick={() => router.push("/")}
                    className={`btn-secondary btn ${styles.printButton}`}
                >
                    {t("ConfirmationPage.backToHome")}
                </button>
            </div>
        </div>
    );
}
