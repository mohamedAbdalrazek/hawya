import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let idToken: string | undefined;
    let role: string | undefined;

    // 🔐 Verify session token
    try {
        const session = request.headers.get("Authorization")?.split(" ")[1];
        if (!session) {
            return NextResponse.json({ ok: false, message: "Authentication token is missing." }, { status: 401 });
        }

        const decoded = verify(session, process.env.JWT_SECRET!) as { uid: string; role: string };
        idToken = decoded.uid;
        role = decoded.role;

    } catch (authError) {
        console.error("Authentication error:", authError);
        return NextResponse.json({ ok: false, message: "Authentication failed" }, { status: 401 });
    }

    // ❗ Validate extracted token info
    if (!idToken) {
        return NextResponse.json({ ok: false, message: "Missing ID token" }, { status: 400 });
    }

    if (role !== "admin") {
        return NextResponse.json({ ok: false, message: "Unauthorized User" }, { status: 401 });
    }

    // 📥 Get users from Firestore
    try {
        const staff = (await firestoreAdmin.collection("users").get()).docs.map((doc) => ({
            ...doc.data(),
        }));
        console.log(staff)
        return NextResponse.json({
            ok: true,
            message: "Users retrieved successfully",
            staff,
        });

    } catch (err) {
        console.error("Failed to fetch users:", err);
        return internalServerError("Something went wrong.");
    }
}
