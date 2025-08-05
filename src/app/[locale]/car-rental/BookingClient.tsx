"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import styles from "./BookingPage.module.css";
import { BookingFormData, ClientCarMap } from "@/utils/types";
import CarImagesSlider from "@/components/home/fleet-preview/CarImagesSlider";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";

export default function BookingForm() {
    const t = useTranslations();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingFormData>({
        defaultValues: {
            rentalType: "daily",
        },
    });

    const [selectedCar, setSelectedCar] = useState<ClientCarMap>();
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [availableCarYears, setAvailableCarYears] = useState<number[]>();
    const selectedModel = watch("model");
    const selectedYear = watch("year");
    const selectedColor = watch("color");
    const rentalType = watch("rentalType");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [cars, setCars] = useState<ClientCarMap[]>([]);

    const params = useSearchParams();
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    useEffect(() => {
        const carId = params.get("carId");
        const fetchCars = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/getCars`);
                if (response.ok) {
                    const data = await response.json();
                    const cars = data.cars;
                    setCars(cars);
                    const models: string[] = Array.from(
                        new Set(cars.map((car: ClientCarMap) => car.model))
                    );
                    if (carId) {
                        const car = cars.filter(
                            (car: ClientCarMap) => car.id === carId
                        )[0];
                        setSelectedCar(car);
                        setValue("model", car.model);
                        setValue("year", car.year);
                    }
                    setAvailableModels(models);
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [params, setValue]);

    useEffect(() => {
        if (selectedModel) {
            const years = cars
                .filter((car) => car.model === selectedModel)
                .map((car) => car.year);
            setAvailableCarYears(years);
            setSelectedCar(undefined);
            setValue("color", "");
        }
    }, [selectedModel, setValue, cars]);

    useEffect(() => {
        if (selectedModel && selectedYear) {
            const car: ClientCarMap | undefined = cars.find(
                (car) =>
                    car.model === selectedModel &&
                    car.year === parseInt(selectedYear)
            );
            setSelectedCar(car);
            setValue("color", "");
        }
    }, [selectedModel, selectedYear, setValue, cars]);

    const onSubmit = async (data: BookingFormData) => {
        console.log("submitting");
        try {
            setSubmitLoading(true);
            data.carId = selectedCar?.id ?? "";
            if (typeof window !== "undefined") {
                localStorage.setItem("bookingData", JSON.stringify(data));
            }

            const response = await fetch("/api/addBooking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to save booking:", errorData);
                toast.error("Failed to submit your booking. Please try again.");
                return;
            }
            const result = await response.json();
            console.log("Booking saved:", result);
            toast.success("Booking saved!")
            router.push("/car-rental/confirmation");
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const priceLabel =
        rentalType === "daily"
            ? `${selectedCar?.priceDay} ${t(`BookingForm.sar`)}/${t(
                  `BookingForm.day`
              )}`
            : `${selectedCar?.priceMonth} ${t(`BookingForm.sar`)}/${t(
                  `BookingForm.month`
              )}`;
    if (loading)
        return (
            <div className={styles.loaderWrapper}>
                <SpinLoader size="lg" />
            </div>
        );
    return (
        <div className={styles.bookingContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("BookingForm.title")}</h1>
                <p className={styles.subtitle}>{t("BookingForm.subtitle")}</p>
            </div>
            <div className={styles.bookingGrid}>
                {selectedCar ? (
                    <div className={styles.carDisplay}>
                        <h2 className={styles.carTitle}>
                            {selectedCar.model}{" "}
                            <span className={styles.carYear}>
                                ({selectedCar.year})
                            </span>
                        </h2>

                        {selectedCar.images[selectedColor]?.length > 0 ? (
                            <div className={styles.sliderContainer}>
                                <CarImagesSlider
                                    images={selectedCar.images[selectedColor]}
                                />
                            </div>
                        ) : (
                            <div className={styles.imageContainer}>
                                <Image
                                    src="/cars/placeholder.jpg"
                                    alt={selectedCar.model}
                                    width={500}
                                    height={400}
                                    className={styles.image}
                                />
                            </div>
                        )}

                        <div className={styles.carDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                    {t("BookingForm.type")}:
                                </span>
                                <span>{selectedCar.type}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                    {t("BookingForm.transmission")}:
                                </span>
                                <span>{selectedCar.transmission}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h3 className={styles.noCarSelected}>
                        {t("BookingForm.noCarSelected")}
                    </h3>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.bookingForm}
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            {t("BookingForm.fullName")}
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: t("BookingForm.errors.required"),
                                minLength: {
                                    value: 3,
                                    message: t("BookingForm.errors.minLength", {
                                        length: 3,
                                    }),
                                },
                            })}
                            className={`${styles.input} ${
                                errors.name ? styles.inputError : ""
                            }`}
                        />
                        {errors.name && (
                            <span className={styles.errorMessage}>
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>
                            {t("BookingForm.phoneNumber")}
                        </label>
                        <input
                            type="tel"
                            {...register("phone", {
                                required: t("BookingForm.errors.required"),
                                pattern: {
                                    value: /^[0-9]{10,15}$/,
                                    message: t(
                                        "BookingForm.errors.phoneInvalid"
                                    ),
                                },
                            })}
                            className={`${styles.input} ${
                                errors.phone ? styles.inputError : ""
                            }`}
                        />
                        {errors.phone && (
                            <span className={styles.errorMessage}>
                                {errors.phone.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="idNumber" className={styles.label}>
                            {t("BookingForm.idNumber")}
                        </label>
                        <input
                            type="text"
                            {...register("idNumber", {
                                required: t("BookingForm.errors.required"),
                                minLength: {
                                    value: 8,
                                    message: t("BookingForm.errors.minLength", {
                                        length: 8,
                                    }),
                                },
                            })}
                            className={`${styles.input} ${
                                errors.idNumber ? styles.inputError : ""
                            }`}
                        />
                        {errors.idNumber && (
                            <span className={styles.errorMessage}>
                                {errors.idNumber.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="birthDate" className={styles.label}>
                            {t("BookingForm.birthDate")}
                        </label>
                        <input
                            type="date"
                            {...register("birthDate", {
                                required: t("BookingForm.errors.required"),
                                validate: (value) => {
                                    const today = new Date();
                                    const birthDate = new Date(value);
                                    const age =
                                        today.getFullYear() -
                                        birthDate.getFullYear();
                                    return (
                                        age >= 18 ||
                                        t("BookingForm.errors.minAge")
                                    );
                                },
                            })}
                            className={`${styles.input} ${
                                errors.birthDate ? styles.inputError : ""
                            }`}
                        />
                        {errors.birthDate && (
                            <span className={styles.errorMessage}>
                                {errors.birthDate.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="model" className={styles.label}>
                            {t("BookingForm.model")}
                        </label>
                        <select
                            {...register("model", {
                                required: t("BookingForm.errors.required"),
                            })}
                            className={`${styles.select} ${
                                errors.model ? styles.inputError : ""
                            }`}
                        >
                            <option value="">
                                {t("BookingForm.selectModel")}
                            </option>
                            {availableModels.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                        {errors.model && (
                            <span className={styles.errorMessage}>
                                {errors.model.message}
                            </span>
                        )}
                    </div>

                    {availableCarYears && (
                        <div className={styles.formGroup}>
                            <label htmlFor="year" className={styles.label}>
                                {t("BookingForm.year")}
                            </label>
                            <select
                                {...register("year", {
                                    required: t("BookingForm.errors.required"),
                                })}
                                className={`${styles.select} ${
                                    errors.year ? styles.inputError : ""
                                }`}
                            >
                                <option value="">
                                    {t("BookingForm.selectYear")}
                                </option>
                                {availableCarYears.map((year) => (
                                    <option key={year} value={year.toString()}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {errors.year && (
                                <span className={styles.errorMessage}>
                                    {errors.year.message}
                                </span>
                            )}
                        </div>
                    )}

                    {selectedCar && (
                        <div className={styles.formGroup}>
                            <label htmlFor="color" className={styles.label}>
                                {t("BookingForm.color")}
                            </label>
                            <select
                                {...register("color", {
                                    required: t("BookingForm.errors.required"),
                                })}
                                className={`${styles.select} ${
                                    errors.color ? styles.inputError : ""
                                }`}
                            >
                                <option value="">
                                    {t("BookingForm.selectColor")}
                                </option>
                                {selectedCar.availableColors.map((color) => (
                                    <option key={color} value={color}>
                                        {t(`carColors.${color}`)}
                                    </option>
                                ))}
                            </select>
                            {errors.color && (
                                <span className={styles.errorMessage}>
                                    {errors.color.message}
                                </span>
                            )}
                        </div>
                    )}

                    {selectedCar && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                {t("BookingForm.rentalType")}
                            </label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        value="daily"
                                        {...register("rentalType")}
                                    />
                                    {t("BookingForm.daily")} (
                                    {selectedCar.priceDay} SAR/day)
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        value="monthly"
                                        {...register("rentalType")}
                                    />
                                    {t("BookingForm.monthly")} (
                                    {selectedCar.priceMonth} SAR/month)
                                </label>
                            </div>
                        </div>
                    )}

                    {selectedCar && (
                        <div className={styles.formGroup}>
                            <label htmlFor="startDate" className={styles.label}>
                                {t("BookingForm.startDate")}
                            </label>
                            <input
                                type="date"
                                {...register("startDate", {
                                    required: t("BookingForm.errors.required"),
                                    validate: (value) => {
                                        const today = new Date();
                                        const inputDate = new Date(value);
                                        today.setHours(0, 0, 0, 0);
                                        inputDate.setHours(0, 0, 0, 0);
                                        return (
                                            inputDate >= today ||
                                            t("BookingForm.errors.futureDate")
                                        );
                                    },
                                })}
                                className={`${styles.input} ${
                                    errors.startDate ? styles.inputError : ""
                                }`}
                            />
                            {errors.startDate && (
                                <span className={styles.errorMessage}>
                                    {errors.startDate.message}
                                </span>
                            )}
                        </div>
                    )}

                    {selectedCar && (
                        <div className={styles.formGroup}>
                            <label htmlFor="period" className={styles.label}>
                                {rentalType === "daily"
                                    ? t("BookingForm.dayPeriod")
                                    : t("BookingForm.monthPeriod")}
                            </label>
                            <input
                                type="number"
                                {...register("period", {
                                    required: t("BookingForm.errors.required"),
                                    min: {
                                        value: 1,
                                        message: t(
                                            "BookingForm.errors.minValue",
                                            {
                                                value: 1,
                                            }
                                        ),
                                    },
                                })}
                                className={`${styles.input} ${
                                    errors.period ? styles.inputError : ""
                                }`}
                            />
                            {errors.period && (
                                <span className={styles.errorMessage}>
                                    {errors.period.message}
                                </span>
                            )}
                        </div>
                    )}

                    {selectedCar && (
                        <div className={styles.priceSummary}>
                            <h3 className={styles.priceTitle}>
                                {t("BookingForm.priceSummary")}
                            </h3>
                            <div className={styles.priceDetail}>
                                <span>
                                    {selectedCar.model}{" "}
                                    {selectedColor
                                        ? t(`carColors.${selectedColor}`)
                                        : ""}
                                </span>
                                <span>{priceLabel}</span>
                            </div>
                        </div>
                    )}

                    <button
                        disabled={submitLoading}
                        type="submit"
                        className={styles.submitButton}
                    >
                        {submitLoading
                            ? "Sending..."
                            : t("BookingForm.submitBooking")}
                    </button>
                </form>
            </div>
        </div>
    );
}
