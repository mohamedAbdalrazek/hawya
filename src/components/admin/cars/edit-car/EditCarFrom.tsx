"use client";

import { useState } from "react";
import styles from "./EditCarForm.module.css";
import {
    CarMap,
    ImagesMap,
    NewCarMap,
    NewImagesMap,
    PostCarMap,
} from "@/utils/types";
import Image from "next/image";
import { carColors } from "@/utils/info";
import toast from "react-hot-toast";
import nookies from "nookies";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaArrowLeft } from "react-icons/fa";
export default function EditCarFrom({ car }: { car: CarMap }) {
    const t = useTranslations("Admin");
    const tc = useTranslations("carColors");

    const [carData, setCarData] = useState<NewCarMap>({
        id: car.id,
        model: car.model,
        year: car.year,
        type: car.type,
        availableColors: car.availableColors,
        transmission: car.transmission,
        priceDay: car.priceDay,
        priceMonth: car?.priceMonth,
        images: Object.keys(car.images).reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {} as NewImagesMap),
    });
    const [initImages, setInitImages] = useState<ImagesMap>(car.images);
    const [loading, setLoading] = useState(false);
    const [newColor, setNewColor] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);

    const router = useRouter();
    const handleRemoveInitImage = (imageId: string) => {
        setImagesToBeDeleted((prev) => [...prev, imageId]);
        const filteredInitImage = initImages[selectedColor].filter(
            (image) => image.imageId !== imageId
        );
        setInitImages((prev) => {
            return { ...prev, [selectedColor]: filteredInitImage };
        });
    };

    const handleRemoveImage = (index: number) => {
        if (!selectedColor) return;

        setCarData((prev) => {
            const updatedImages = [...(prev.images[selectedColor] || [])];
            updatedImages.splice(index, 1); // Remove the selected image

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
        if (carData.images[color]) {
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
        }
        if (initImages[color]) {
            const imagesIdArray = initImages[color].map(
                (image) => image.imageId ?? ""
            );
            setImagesToBeDeleted((prev) => [...prev, ...imagesIdArray]);
            setInitImages((prev) => {
                const newInitImages = { ...prev };

                delete newInitImages[color];
                return newInitImages;
            });
        }
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
                toast.error(t("CarsPage.EditCarPage.unauthorized"));
                return;
            }

            const images: ImagesMap = {};

            const uploadTasks = Object.entries(carData.images).map(
                async ([color, files]) => {
                    const imageUploadPromises = files.map((file) =>
                        uploadImage(file, session)
                    );
                    try {
                        const uploadedImages = await Promise.all(
                            imageUploadPromises
                        );
                        images[color] = uploadedImages ?? [];
                    } catch (uploadError) {
                        console.error(
                            `Image upload failed for color: ${color}`,
                            uploadError
                        );
                        images[color] = [];
                    }
                }
            );

            await Promise.all(uploadTasks);
            imagesToBeDeleted.forEach(async (imageId) => {
                try {
                    await fetch(`/api/admin/delete-image?imageId=${imageId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${session}`,
                        },
                    });
                } catch (err) {
                    console.error(err);
                }
            });
            Object.entries(initImages).forEach(([color, imagesArray]) => {
                images[color] = [...images[color], ...imagesArray];
            });
            const formedCar: PostCarMap = {
                ...carData,
                images,
            };

            const response = await fetch("/api/admin/edit-car", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(formedCar),
            });

            if (response.ok) {
                await response.json();
                toast.success(t("CarsPage.EditCarPage.success"));
                router.push("/dashboard/admin/cars");
            } else {
                const error = await response.json();
                console.error("Failed to Edit car:", error);
                toast.error(t("CarsPage.EditCarPage.error"));
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error(t("CarsPage.EditCarPage.error"));
            // No toast here either
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link
                    href="/dashboard/admin/bookings"
                    className={styles.backLink}
                >
                    <FaArrowLeft /> {t("CarsPage.EditCarPage.back")}
                </Link>
                <h1>{t("CarsPage.EditCarPage.title")}</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="model">
                        {t("CarsPage.EditCarPage.model")}
                    </label>
                    <input
                        disabled={loading}
                        type="text"
                        id="model"
                        name="model"
                        value={carData.model}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="year">
                        {t("CarsPage.EditCarPage.year")}
                    </label>
                    <input
                        disabled={loading}
                        type="number"
                        id="year"
                        name="year"
                        min="2000"
                        max={new Date().getFullYear() + 1}
                        value={carData.year}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="type">
                        {t("CarsPage.EditCarPage.type")}
                    </label>
                    <input
                        disabled={loading}
                        type="text"
                        id="type"
                        name="type"
                        value={carData.type}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="transmission">
                        {t("CarsPage.EditCarPage.transmission")}
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
                        {t("CarsPage.EditCarPage.priceDay")}
                    </label>
                    <input
                        disabled={loading}
                        type="number"
                        id="priceDay"
                        name="priceDay"
                        min="0"
                        step="0.01"
                        value={carData.priceDay}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="priceMonth">
                        {t("CarsPage.EditCarPage.priceMonth")}
                    </label>
                    <input
                        disabled={loading}
                        type="number"
                        id="priceMonth"
                        name="priceMonth"
                        min="0"
                        step="0.01"
                        value={carData.priceMonth}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>{t("CarsPage.EditCarPage.availableColors")}</label>
                    <div className={styles.colorInputGroup}>
                        <select
                            id="newColorSelect"
                            disabled={loading}
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className={styles.colorSelect}
                        >
                            <option value="">
                                {t("CarsPage.EditCarPage.selectColor")}
                            </option>
                            {carColors.map((color) => (
                                <option key={color} value={color}>
                                    {tc(color)}
                                </option>
                            ))}
                        </select>
                        <button
                            disabled={loading}
                            type="button"
                            onClick={handleAddColor}
                            className={styles.addButton}
                        >
                            {t("CarsPage.EditCarPage.addColor")}
                        </button>
                    </div>

                    {carData.availableColors.length > 0 && (
                        <div className={styles.colorList}>
                            {carData.availableColors.map((color) => (
                                <div key={color} className={styles.colorItem}>
                                    <span>{tc(color)}</span>
                                    <button
                                        disabled={loading}
                                        type="button"
                                        onClick={() => handleRemoveColor(color)}
                                        className={styles.removeButton}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {carData.availableColors.length > 0 && (
                    <div className={styles.formGroup}>
                        <label htmlFor="colorSelect">
                            {t("CarsPage.EditCarPage.selectColorImage")}
                        </label>
                        <select
                            id="colorSelect"
                            value={selectedColor}
                            disabled={loading}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className={styles.colorSelect}
                        >
                            <option value="">
                                {t("CarsPage.EditCarPage.selectColor")}
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
                                    {t("CarsPage.EditCarPage.uploadImages")} (
                                    {tc(selectedColor)})
                                </label>
                                <input
                                    disabled={loading}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className={styles.fileInput}
                                    value={""}
                                />
                                <div className={styles.previewGrid}>
                                    {initImages[selectedColor] &&
                                        initImages[selectedColor].length >
                                            0 && (
                                            <>
                                                {initImages[selectedColor].map(
                                                    (src) => (
                                                        <div
                                                            key={src.imageId}
                                                            className={
                                                                styles.previewItem
                                                            }
                                                        >
                                                            <button
                                                                disabled={
                                                                    loading
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveInitImage(
                                                                        src.imageId ??
                                                                            ""
                                                                    )
                                                                }
                                                                className={
                                                                    styles.removeImageBtn
                                                                }
                                                            >
                                                                ×
                                                            </button>
                                                            <Image
                                                                src={
                                                                    src.imageUrl
                                                                }
                                                                alt={`Preview ${src.imageId}`}
                                                                width={400}
                                                                height={400}
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        )}

                                    {carData.images[selectedColor] &&
                                        carData.images[selectedColor].length >
                                            0 && (
                                            <>
                                                {" "}
                                                {carData.images[
                                                    selectedColor
                                                ].map((src, index) => (
                                                    <div
                                                        key={index}
                                                        className={
                                                            styles.previewItem
                                                        }
                                                    >
                                                        <button
                                                            disabled={loading}
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveImage(
                                                                    index
                                                                )
                                                            }
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
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            width={400}
                                                            height={400}
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <button
                    disabled={loading}
                    type="submit"
                    className={styles.submitButton}
                >
                    {loading
                        ? t("CarsPage.EditCarPage.loading")
                        : t("CarsPage.EditCarPage.submit")}
                </button>
            </form>
        </div>
    );
}
const uploadImage = async (file: File, session: string) => {
    const formData = new FormData();
    formData.append("imageFile", file);

    try {
        const response = await fetch("/api/admin/upload-image", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Upload failed:", error);
            throw new Error(error.message || "Failed to upload image");
        }

        const data = await response.json();

        if (!data.imageUrl || !data.imageId) {
            throw new Error("Incomplete image data returned from server.");
        }

        return {
            imageUrl: data.imageUrl as string,
            imageId: data.imageId as string,
        };
    } catch (err) {
        console.error("Error during image upload:", err);
        throw err; // Let the caller handle it (as you do in handleSubmit)
    }
};
