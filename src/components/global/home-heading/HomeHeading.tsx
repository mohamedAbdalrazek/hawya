import React from "react";
import styles from "./HomeHeading.module.css";
export default function HomeHeading({ text }: { text?: string }) {
    return <h2 className={styles.title}>{text}</h2>;
}
