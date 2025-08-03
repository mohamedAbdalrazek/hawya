"use client";
import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import { ReactNode } from "react";
import styles from "./AdminLayout.module.css";
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.adminLayout}>
            <AdminSidebar />
            <main
                className={styles.adminContent}
                
            >
                {children}
            </main>
        </div>
    );
}
