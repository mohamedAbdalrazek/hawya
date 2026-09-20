import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { ensureLocationsSeeded } from "@/utils/locationSeed";
import { isAuthError, requireAdmin } from "@/utils/requireAdmin";
import { internalServerError } from "@/utils/responses";
import { LocationMap } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const auth = requireAdmin(request);
    if (isAuthError(auth)) return auth;

    const locationId = request.nextUrl.searchParams.get("locationId");

    try {
        await ensureLocationsSeeded();

        if (locationId) {
            const doc = await firestoreAdmin
                .collection("locations")
                .doc(locationId)
                .get();
            if (!doc.exists) {
                return NextResponse.json(
                    { ok: false, message: "Location not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                ok: true,
                location: { id: doc.id, ...doc.data() } as LocationMap,
            });
        }

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
