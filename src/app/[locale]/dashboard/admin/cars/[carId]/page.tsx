"use client";

import { useEffect, useState } from "react";
import { CarMap } from "@/utils/types";
import toast from "react-hot-toast";
import nookies from "nookies";
import { useParams } from "next/navigation";
import EditCarFrom from "@/components/admin/cars/edit-car/EditCarFrom";
import SpinLoader from "@/components/global/spin-loader/SpinLoader";
export default function AddCarPage() {
    const [car, setCar] = useState<CarMap | null>(null);

    const [loading, setLoading] = useState(true);

    const params = useParams();
    const carId = params.carId;

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true);
                const cookies = nookies.get();
                const session = cookies["session"];
                if (!session) {
                    toast.error("You are not authenticated.");
                    return;
                }
                const response = await fetch(
                    `/api/admin/get-cars?carId=${carId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setCar(data.car);
                } else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId]);
    if (loading) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <SpinLoader size="lg" />
            </div>
        );
    }
    if (!car) return;

    return <EditCarFrom car={car} />;
}
