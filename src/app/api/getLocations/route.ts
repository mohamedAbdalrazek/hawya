import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { ensureLocationsSeeded } from "@/utils/locationSeed";
import { internalServerError } from "@/utils/responses";
import { LocationMap } from "@/utils/types";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ensureLocationsSeeded();
        const snapshot = await firestoreAdmin
            .collection("locations")
            .orderBy("sortOrder", "asc")
            .get();
        const locations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as LocationMap[];
        return NextResponse.json({ ok: true, locations });
    } catch (err) {
        console.error("Failed to fetch locations:", err);
        return internalServerError("Something went wrong.");
    }
}
