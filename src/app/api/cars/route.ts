import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { CarsRepo } from "@/app/repos/cars-repo";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         const cars = await CarsRepo.find()
//         return NextResponse.json(cars, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })
//     }

// }
// export async function POST(request: Request) {
//     let data;
//     try {
//         data = await request.json()
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
//     }
//     if (!data.model_id || !data.carColor || !data.pricePerDay || !data.pricePerMonth) {
//         return NextResponse.json({ error: "Some data are missing" }, { status: 400 })
//     }
//     try {
//         const cars = await CarsRepo.insert(data.model_id, data.carColor, data.pricePerDay, data.pricePerMonth)
//         return NextResponse.json(cars, { status: 201 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json("Something went wrong in the server side", { status: 500 })
//     }
// }