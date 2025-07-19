import CarImagesSlider from "@/components/home/fleet-preview/CarImagesSlider";
import { Link } from "@/i18n/navigation";
import { CarMap } from "@/utils/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import styles from "./CardCard.module.css";

const CarCard = ({ car }: { car: CarMap }) => {
    const t = useTranslations();
    const [selectedColor, setSelectedColor] = useState(car.availableColors[0]);

    return (
        <div key={car.id} className={styles.card}>
            {car.images[selectedColor].length ? (
                <CarImagesSlider images={car.images[selectedColor]} />
            ) : (
                <div className={styles.imageContainer}>
                    <Image
                        src="/cars/placeholder.jpg"
                        alt={car.model}
                        width={500}
                        height={400}
                        className={styles.image}
                    />
                </div>
            )}

            <div className={styles.priceTag}>
                <span className={styles.price}>
                    {t("CarsSection.pricePerDay", {
                        price: car.priceDay,
                    })}
                </span>
                <span className={styles.priceLabel}></span>
                <span className={styles.monthlyPrice}>
                    {t("CarsSection.pricePerMonth", {
                        price: car.priceMonth,
                    })}
                </span>
            </div>

            <div className={styles.content}>
                <div className={styles.modelHeader}>
                    <h3 className={styles.model}>
                        {car.model}
                    </h3>
                    <span className={styles.year}>{car.year}</span>
                </div>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            {t("CarsSection.type")}
                        </span>
                        <span>{car.type}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            {t("CarsSection.color")}
                        </span>
                        <div className={styles.colorsWrapper}>
                            {car.availableColors.map((color) => {
                                const isActive = selectedColor === color; 
                                return (
                                    <button
                                        key={color}
                                        className={`${styles.color} ${
                                            isActive ? styles.active : ""
                                        }`}
                                        style={{
                                            backgroundColor:
                                                color.toLowerCase(),
                                            borderColor:
                                                color.toLowerCase() === "white"
                                                    ? "var(--neutral-600)"
                                                    : "transparent",
                                        }}
                                        onClick={() => setSelectedColor(color)}
                                        aria-label={`Select ${color} color`}
                                        aria-pressed={isActive}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            {t("CarsSection.transmission")}
                        </span>
                        <span>{car.transmission}</span>
                    </div>
                </div>

                <Link href={`/car-rental?carId=${car.id}`} className={styles.ctaButton}>
                    {t("CarsSection.bookNow")}
                </Link>
            </div>
        </div>
    );
};
export default CarCard;
