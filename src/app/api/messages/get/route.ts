import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { MessageAdminMap } from "@/utils/types";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const session = request.headers.get("Authorization")?.split(" ")[1];
        if (!session) {
            return NextResponse.json(
                { ok: false, message: "Authentication token is missing." },
                { status: 401 }
            );
        }

        const decoded = verify(session, process.env.JWT_SECRET!) as {
            uid: string;
        };

        if (!decoded?.uid) {
            return NextResponse.json(
                { ok: false, message: "Invalid or missing user ID" },
                { status: 400 }
            );
        }
        const searchParams = request.nextUrl.searchParams;

        const offset = parseInt(searchParams.get("offset") || "0", 10);
        const limit = parseInt(searchParams.get("limit") || "9", 10);
        const snapshot = await firestoreAdmin.collection("messages").get();

        const formedMessages = snapshot.docs
            .map((doc) => ({
                ...doc.data(),
                id: doc.id,
                createTime: doc.createTime.toDate(), // convert to JS Date
            }) as MessageAdminMap).sort((a, b) => b.createTime.getTime() - a.createTime.getTime());

        const paginatedMessages = formedMessages.slice(offset, offset + limit);

        return NextResponse.json({
            ok: true,
            message: "Messages retrieved successfully",
            messages: paginatedMessages,
            total: formedMessages.length,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return internalServerError("Something went wrong.");
    }
}
