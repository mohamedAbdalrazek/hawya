import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const carId = searchParams.get("carId");

    // 🔐 Extract & verify JWT token from Authorization header
    const session = request.headers.get("Authorization")?.split(" ")[1];
    if (!session) {
        return NextResponse.json(
            { ok: false, message: "Authentication token is missing." },
            { status: 401 }
        );
    }

    let idToken: string;
    try {
        const decoded = verify(session, process.env.JWT_SECRET!) as { uid: string; role: string };
        idToken = decoded.uid;
    } catch (authError) {
        console.error("Authentication error:", authError);
        return NextResponse.json(
            { ok: false, message: "Authentication failed." },
            { status: 401 }
        );
    }
    if (!idToken) {
        return NextResponse.json({ ok: false, message: "Missing ID token" }, { status: 400 });
    }
    if (!carId) {
        return NextResponse.json(
            { ok: false, message: "Missing car ID." },
            { status: 400 }
        );
    }

    try {
        await firestoreAdmin.collection("cars").doc(carId).delete();
        return NextResponse.json({
            ok: true,
            message: "Car deleted successfully from Firestore.",
        });
    } catch (err) {
        console.error("Failed to delete car:", err);
        return internalServerError("Something went wrong.");
    }
}
