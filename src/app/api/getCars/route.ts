import { cars } from "@/utils/info";
import { internalServerError } from "@/utils/responses";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const typeFilter = searchParams.get("type")?.toLowerCase() ?? null;
    const modelFilter = searchParams.get("model")?.toLowerCase() ?? null;
    const colorFilter = searchParams.get("color") ?? null;
    const yearFilter = searchParams.get("year") ?? null;

    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    try {
        const filteredCars = cars.filter((car) => {
            const type = car.type?.toLowerCase() ?? "";
            const model = car.model?.toLowerCase() ?? "";
            const color = car.color ?? "";
            const year = car.year ?? "";

            return (
                (!typeFilter || type.includes(typeFilter)) &&
                (!modelFilter || model.includes(modelFilter)) &&
                (!colorFilter || color === colorFilter) &&
                (!yearFilter || year.toString() === yearFilter)
            );
        });

        const paginatedCars = filteredCars.slice(offset, offset + limit);
        
        return Response.json({
            ok: true,
            cars: paginatedCars,
            total: filteredCars.length, // for frontend to know when to stop
        });
    } catch (err) {
        console.error("Failed to fetch filtered cars:", err);
        return internalServerError("Something went wrong.");
    }
}
