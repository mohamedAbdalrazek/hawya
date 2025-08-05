import Link from "next/link";
import styles from "./NotFound.module.css";
export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.errorCode}>404</div>
                <h1 className={styles.title}>Page Not Found</h1>
                <p className={styles.description}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className={styles.actions}>
                    <Link href="/" className={styles.homeButton}>
                        Go to Homepage
                    </Link>
                    <Link href="/contact" className={styles.contactButton}>
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
