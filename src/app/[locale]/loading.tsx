import SpinLoader from "@/components/global/spin-loader/SpinLoader";
import React from "react";

export default function loading() {
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <SpinLoader size="lg" />
        </div>
    );
}
