import { cars } from "@/utils/info";
import { internalServerError } from "@/utils/responses";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const typeFilter = searchParams.get("type")?.toLowerCase() ?? null;
    const modelFilter = searchParams.get("model")?.toLowerCase() ?? null;
    const yearFilter = searchParams.get("year") ?? null;
    const dailyPriceRange = searchParams.get("dailyPriceRange") ?? null;
    const monthlyPriceRange = searchParams.get("monthlyPriceRange") ?? null;

    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    let dailyMinPrice: number|null = null;
    let dailyMaxPrice: number|null = null;
    if (dailyPriceRange) {
        const [minStr, maxStr] = dailyPriceRange.split("-");
        dailyMinPrice = minStr ? parseFloat(minStr) : null;
        dailyMaxPrice = maxStr ? parseFloat(maxStr) : null;
    }
    let monthlyMinPrice: number|null = null;
    let monthlyMaxPrice: number|null = null;
    if (monthlyPriceRange) {
        const [minStr, maxStr] = monthlyPriceRange.split("-");
        monthlyMinPrice = minStr ? parseFloat(minStr) : null;
        monthlyMaxPrice = maxStr ? parseFloat(maxStr) : null;
    }
    try {
        const filteredCars = cars.filter((car) => {
            const type = car.type?.toLowerCase() ?? "";
            const model = car.model?.toLowerCase() ?? "";
            const year = car.year ?? "";
            const priceDay = car.priceDay ?? 0;
            const priceMonth = car.priceMonth ?? 0;
            return (
                (!typeFilter || type.includes(typeFilter)) &&
                (!modelFilter || model.includes(modelFilter)) &&
                (!yearFilter || year.toString() === yearFilter) &&
                (!dailyMinPrice || priceDay >= dailyMinPrice) &&
                (!dailyMaxPrice || priceDay <= dailyMaxPrice)&&
                (!monthlyMinPrice || priceMonth >= monthlyMinPrice) &&
                (!monthlyMaxPrice || priceMonth <= monthlyMaxPrice)

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
