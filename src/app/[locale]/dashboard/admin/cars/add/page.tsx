"use client";

import { useState } from "react";
import styles from "./AddCarPage.module.css";
import { ImagesMap, NewCarMap, PostCarMap } from "@/utils/types";
import Image from "next/image";
import { carColors } from "@/utils/info";
import toast from "react-hot-toast";
import nookies from "nookies";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaArrowLeft } from "react-icons/fa";

export default function AddCarPage() {
    const t = useTranslations("Admin");
    const tc = useTranslations("carColors");
    const [carData, setCarData] = useState<Omit<NewCarMap, "id">>({
        model: "",
        year: new Date().getFullYear(),
        type: "",
        availableColors: [],
        transmission: "Automatic",
        priceDay: 0,
        priceMonth: 0,
        images: {},
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [newColor, setNewColor] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const handleRemoveImage = (index: number) => {
        if (!selectedColor) return;

        setCarData((prev) => {
            const updatedImages = [...(prev.images[selectedColor] || [])];
            updatedImages.splice(index, 1);
            return {
                ...prev,
                images: {
                    ...prev.images,
                    [selectedColor]: updatedImages,
                },
            };
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCarData((prev) => ({
            ...prev,
            [name]:
                name === "year" || name === "priceDay" || name === "priceMonth"
                    ? Number(value)
                    : value,
        }));
    };

    const handleAddColor = () => {
        if (
            newColor &&
            !carData.availableColors.includes(newColor.toLowerCase())
        ) {
            const color = newColor.toLowerCase();
            setCarData((prev) => ({
                ...prev,
                availableColors: [...prev.availableColors, color],
                images: {
                    ...prev.images,
                    [color]: [],
                },
            }));
            setNewColor("");
        }
    };

    const handleRemoveColor = (color: string) => {
        setCarData((prev) => {
            const newImages = { ...prev.images };
            delete newImages[color];
            return {
                ...prev,
                availableColors: prev.availableColors.filter(
                    (c) => c !== color
                ),
                images: newImages,
            };
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && selectedColor) {
            const files = Array.from(e.target.files);
            setCarData((prev) => ({
                ...prev,
                images: {
                    ...prev.images,
                    [selectedColor]: [...prev.images[selectedColor], ...files],
                },
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cookies = nookies.get();
            const session = cookies["session"];
            if (!session) {
                toast.error(t("CarsPage.AddCarPage.unauthorized"));
                return;
            }

            const images: ImagesMap = {};
            const uploadTasks = Object.entries(carData.images).map(
                async ([color, files]) => {
                    try {
                        const uploadedImages = await Promise.all(
                            files.map((file) => uploadImage(file, session))
                        );
                        images[color] = uploadedImages ?? [];
                    } catch (uploadError) {
                        console.error(
                            `Image upload failed for ${color}`,
                            uploadError
                        );
                        images[color] = [];
                    }
                }
            );

            await Promise.all(uploadTasks);

            const formedCar: PostCarMap = { ...carData, images };

            const response = await fetch("/api/admin/add-car", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(formedCar),
            });

            if (response.ok) {
                toast.success(t("CarsPage.AddCarPage.success"));
                router.push("/dashboard/admin/cars");
            } else {
                toast.error(t("CarsPage.AddCarPage.error"));
            }
        } catch (err) {
            toast.error(t("CarsPage.AddCarPage.error"));
            console.error("Error adding car:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/dashboard/admin/bookings" className={styles.backLink}>
                    <FaArrowLeft /> {t("CarsPage.AddCarPage.back")}
                </Link>
                <h1>{t("CarsPage.AddCarPage.title")}</h1>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="model">
                        {t("CarsPage.AddCarPage.model")}
                    </label>
                    <input
                        disabled={loading}
                        type="text"
                        name="model"
                        value={carData.model}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="year">
                        {t("CarsPage.AddCarPage.year")}
                    </label>
                    <input
                        disabled={loading}
                        type="number"
                        name="year"
                        value={carData.year}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="type">
                        {t("CarsPage.AddCarPage.type")}
                    </label>
                    <input
                        disabled={loading}
                        type="text"
                        name="type"
                        value={carData.type}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="transmission">
                        {t("CarsPage.AddCarPage.transmission")}
                    </label>
                    <select
                        id="transmission"
                        name="transmission"
                        disabled={loading}
                        value={carData.transmission}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="priceDay">
                        {t("CarsPage.AddCarPage.pricePerDay")}
                    </label>
                    <input
                        disabled={loading}
                        type="number"
                        name="priceDay"
                        value={carData.priceDay}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="priceMonth">
                        {t("CarsPage.AddCarPage.pricePerMonth")}
                    </label>
                    <input
                        disabled={loading}
                        type="number"
                        name="priceMonth"
                        value={carData.priceMonth}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Color input section */}
                <div className={styles.formGroup}>
                    <label>{t("CarsPage.AddCarPage.availableColors")}</label>
                    <div className={styles.colorInputGroup}>
                        <select
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">
                                {t("CarsPage.AddCarPage.selectColor")}
                            </option>
                            {carColors.map((color) => (
                                <option key={color} value={color}>
                                    {tc(color)}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddColor}
                            disabled={loading}
                            className={styles.addButton}
                        >
                            {t("CarsPage.AddCarPage.addColor")}
                        </button>
                    </div>

                    <div className={styles.colorList}>
                        {carData.availableColors.map((color) => (
                            <div key={color} className={styles.colorItem}>
                                <span>{tc(color)}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveColor(color)}
                                    disabled={loading}
                                    className={styles.removeButton}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image upload */}
                {carData.availableColors.length > 0 && (
                    <div className={styles.formGroup}>
                        <label>
                            {t("CarsPage.AddCarPage.selectColorForImages")}
                        </label>
                        <select
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">
                                {t("CarsPage.AddCarPage.selectColor")}
                            </option>
                            {carData.availableColors.map((color) => (
                                <option key={color} value={color}>
                                    {tc(color)}
                                </option>
                            ))}
                        </select>

                        {selectedColor && (
                            <>
                                <label>
                                    {t(
                                        "CarsPage.AddCarPage.uploadImagesForColor",
                                        { color: selectedColor }
                                    )}
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={loading}
                                />
                                {carData.images[selectedColor]?.length > 0 && (
                                    <div>
                                        <p>
                                            {t(
                                                "CarsPage.AddCarPage.imagesSelected",
                                                {
                                                    count: carData.images[
                                                        selectedColor
                                                    ].length,
                                                    color: selectedColor,
                                                }
                                            )}
                                        </p>
                                        <div className={styles.previewGrid}>
                                            {carData.images[selectedColor].map(
                                                (src, index) => (
                                                    <div key={index} className={styles.previewItem}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveImage(
                                                                    index
                                                                )
                                                            }
                                                            disabled={loading}
                                                            className={
                                                                styles.removeImageBtn
                                                            }
                                                        >
                                                            ×
                                                        </button>
                                                        <Image
                                                            src={URL.createObjectURL(
                                                                src
                                                            )}
                                                            alt={`Preview ${index}`}
                                                            width={100}
                                                            height={100}
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? t("CarsPage.AddCarPage.loading")
                        : t("CarsPage.AddCarPage.submit")}
                </button>
            </form>
        </div>
    );
}

const uploadImage = async (file: File, session: string) => {
    const formData = new FormData();
    formData.append("imageFile", file);

    const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${session}` },
        body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    return { imageUrl: data.imageUrl, imageId: data.imageId };
};
