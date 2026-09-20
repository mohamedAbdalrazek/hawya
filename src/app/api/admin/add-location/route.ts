import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import {
    isLocationWriteError,
    parseLocationWrite,
} from "@/utils/locationPayload";
import { isAuthError, requireAdmin } from "@/utils/requireAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const auth = requireAdmin(request);
    if (isAuthError(auth)) return auth;

    let data: unknown;
    try {
        data = await request.json();
    } catch (err) {
        console.error("Invalid JSON body:", err);
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    const parsed = parseLocationWrite(data);
    if (isLocationWriteError(parsed)) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    try {
        await firestoreAdmin.collection("locations").add(parsed);
        return NextResponse.json({ message: "Location added successfully" });
    } catch (firestoreError) {
        console.error("Error writing location:", firestoreError);
        return NextResponse.json(
            { error: "Failed to store location" },
            { status: 500 }
        );
    }
}
