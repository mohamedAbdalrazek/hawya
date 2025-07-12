import React from "react";
import styles from "./CarsSkeletonLoading.module.css";

const CarsSkeletonLoading = ({ number }: { number: number }) => {
    return (
        <div className={`container ${styles.grid}`}>
            {Array.from({ length: number }).map((_, index) => (
                <div className={styles.card} key={index}>
                    <div className={styles.imageSkeleton} />

                    <div className={styles.priceTag}>
                        <div className={styles.priceLine}></div>
                        <div className={styles.priceLine}></div>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.titleRow}>
                            <div className={styles.title}></div>
                            <div className={styles.year}></div>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.detailItem}></div>
                            <div className={styles.detailItem}></div>
                            <div className={styles.detailItem}></div>
                            <div className={styles.detailItem}></div>
                        </div>
                        <div className={styles.button}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarsSkeletonLoading;
