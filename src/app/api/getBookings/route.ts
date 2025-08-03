import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { BookingFormData } from "@/utils/types";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get("bookingId");

    try {
        if (bookingId) {
            const doc = await firestoreAdmin.collection("bookings").doc(bookingId).get();

            if (!doc.exists) {
                return NextResponse.json(
                    { ok: false, message: "Booking not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                ok: true,
                message: "Booking retrieved successfully",
                booking: { id: doc.id, ...doc.data() },
            });
        }

        const session = request.headers.get("Authorization")?.split(" ")[1];
        if (!session) {
            return NextResponse.json(
                { ok: false, message: "Authentication token is missing." },
                { status: 401 }
            );
        }

        const decoded = verify(session, process.env.JWT_SECRET!) as {
            uid: string;
            role: string;
        };

        if (!decoded?.uid) {
            return NextResponse.json(
                { ok: false, message: "Invalid or missing user ID" },
                { status: 400 }
            );
        }

        const searchParams = request.nextUrl.searchParams;

        const phoneFilter = searchParams.get("phone")?.toLowerCase() ?? null;
        const nameFilter = searchParams.get("name")?.toLowerCase() ?? null;
        const modelFilter = searchParams.get("model") ?? null;
        const dateFilter = searchParams.get("date") ?? null;

        const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);


        const snapshot = await firestoreAdmin.collection("bookings").get();

        

        const filteredBookings = snapshot.docs
            .map((doc) => ({
                ...doc.data(),
                id: doc.id,
                createTime: doc.createTime.toDate(), // convert to JS Date
            }) as BookingFormData & { createTime: Date })
            .filter((appt) => {
                const phone = appt.phone?.toLowerCase() ?? "";
                const name = decodeURIComponent(appt.name)?.toLowerCase() ?? "";
                const model = appt.model ?? "";
                const date = appt.startDate ?? "";
                const decodedDateFilter = dateFilter ? decodeURIComponent(dateFilter) : null;
                return (
                    (!phoneFilter || phone.includes(phoneFilter)) &&
                    (!nameFilter || name.includes(nameFilter)) &&
                    (!modelFilter || model.includes(modelFilter)) &&
                    (!decodedDateFilter || decodedDateFilter === date)
                );
            })
            .sort((a, b) => b.createTime.getTime() - a.createTime.getTime());

        const paginatedBookings = filteredBookings.slice(offset, offset + limit);
        return NextResponse.json({
            ok: true,
            message: "Bookings retrieved successfully",
            bookings: paginatedBookings,
            total: filteredBookings.length,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return internalServerError("Something went wrong.");
    }
}
