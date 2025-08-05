import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { CarMap } from "@/utils/types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const snapshot = await firestoreAdmin.collection("cars").get();

        const models = new Set<string>();
        const years = new Set<number>();
        const types = new Set<string>();

        snapshot.forEach((doc) => {
            const car = doc.data() as CarMap;
            if (car.model) models.add(car.model);
            if (car.year) years.add(car.year);
            if (car.type) types.add(car.type);
        });

        return NextResponse.json({
            models: Array.from(models),
            years: Array.from(years),
            types: Array.from(types),
        });
    } catch (error) {
        console.error("Error fetching cars:", error);
        return NextResponse.json(
            { error: "Failed to fetch car data" },
            { status: 500 } 
        );
    }
}
