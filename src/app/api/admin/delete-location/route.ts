import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { isAuthError, requireAdmin } from "@/utils/requireAdmin";
import { internalServerError } from "@/utils/responses";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const auth = requireAdmin(request);
    if (isAuthError(auth)) return auth;

    const locationId = request.nextUrl.searchParams.get("locationId");
    if (!locationId) {
        return NextResponse.json(
            { ok: false, message: "Missing location ID." },
            { status: 400 }
        );
    }

    try {
        await firestoreAdmin.collection("locations").doc(locationId).delete();
        return NextResponse.json({
            ok: true,
            message: "Location deleted successfully from Firestore.",
        });
    } catch (err) {
        console.error("Failed to delete location:", err);
        return internalServerError("Something went wrong.");
    }
}
