import { firestoreAdmin, authAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    let idToken: string | undefined;
    let role: string | undefined;
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name")?.toLowerCase();
    const email = searchParams.get("email")?.toLowerCase();

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

    if (!idToken) {
        return NextResponse.json({ ok: false, message: "Missing ID token" }, { status: 400 });
    }

    if (role !== "admin") {
        return NextResponse.json({ ok: false, message: "Unauthorized User" }, { status: 401 });
    }

    if (!name || !email) {
        return NextResponse.json({ ok: false, message: "Missing user info" }, { status: 400 });
    }

    try {
        const usersRef = firestoreAdmin.collection("users");
        const querySnapshot = await usersRef
            .where("name", "==", name)
            .where("email", "==", email)
            .get();

        if (querySnapshot.empty) {
            return NextResponse.json({ ok: false, message: "No matching user found." }, { status: 404 });
        }

        const batch = firestoreAdmin.batch();
        const failedDeletions: string[] = [];

        for (const doc of querySnapshot.docs) {
            const uid = doc.id;

            // Add Firestore delete to batch
            batch.delete(doc.ref);

            // Try deleting from Firebase Auth
            if (uid) {
                try {
                    await authAdmin.deleteUser(uid);
                } catch (authError) {
                    console.error(`Failed to delete auth user ${uid}:`, authError);
                    failedDeletions.push(uid);
                }
            } else {
                console.warn(`User document ${doc.id} missing uid field`);
                failedDeletions.push(`missing-uid-${doc.id}`);
            }
        }

        await batch.commit();

        if (failedDeletions.length > 0) {
            return NextResponse.json({
                ok: false,
                message: `Deleted user(s) from Firestore, but failed to remove auth accounts for: ${failedDeletions.join(", ")}.`,
            });
        }

        return NextResponse.json({ ok: true, message: "User(s) deleted successfully from Firestore and Firebase Auth." });

    } catch (err) {
        console.error("Failed to delete user:", err);
        return internalServerError("Something went wrong.");
    }
}
