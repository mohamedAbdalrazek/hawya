import { cars } from "@/utils/info";
import { internalServerError } from "@/utils/responses";

export async function GET() {

    let minDaily = Infinity;
    let maxDaily = 0
    let minMonthly = Infinity;
    let maxMonthly = 0
    try {
        cars.forEach((car) => {
            if (car.priceDay <= minDaily) minDaily = car.priceDay
            if (car.priceDay >= maxDaily) maxDaily = car.priceDay
            if (car.priceMonth <= minMonthly) minMonthly = car.priceMonth
            if (car.priceMonth >= maxMonthly) maxMonthly = car.priceMonth
        })


        return Response.json({
            ok: true,
            dailyRange: [minDaily, maxDaily],
            monthlyRange: [minMonthly, maxMonthly]
        });
    } catch (err) {
        console.error("Failed to fetch filtered cars:", err);
        return internalServerError("Something went wrong.");
    }
}
