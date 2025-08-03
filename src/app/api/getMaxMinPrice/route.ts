import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { internalServerError } from "@/utils/responses";
import { CarMap } from "@/utils/types";

export async function GET() {

    let minDaily = Infinity;
    let maxDaily = 0
    let minMonthly = Infinity;
    let maxMonthly = 0
    const cars = (await firestoreAdmin.collection("cars").get()).docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
    } as CarMap));
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
