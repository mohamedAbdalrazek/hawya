import React from "react";
import styles from "./SpinLoader.module.css"; // Adjust the path as necessary
const SpinLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    return (
        <div
            className={`${styles.spinner} ${styles[size]}`}
            aria-label="loading..."
        />
    );
};

export default SpinLoader;
