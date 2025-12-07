import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { BrandsRepo } from "@/app/repos/brands-repo";
// import { NextResponse } from "next/server";

// export async function GET() {
//     let cars
//     try {
//         cars = await BrandsRepo.find()
//     }
//     catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Somthing went wrong in the server" }, { status: 500 })
//     }
//     return NextResponse.json(cars)



// }
// export async function POST(req: Request) {
//     let name
//     try {

//         name = (await req.json()).name
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
//     }

//     if (!name) {
//         return NextResponse.json({ error: "Brand name is missing" }, { status: 400 })
//     }
//     let brand
//     try {
//         brand = await BrandsRepo.insert(name)
//     } catch (err) {
//         console.error(err)
//         return NextResponse.json({ error: "Somthing went wrong in the server side" }, { status: 500 })
//     }
//     if (brand) {
//         return NextResponse.json(brand, { status: 201 })
//     }
//     return NextResponse.json({ error: "Somthing went wrong" }, { status: 404 })


// }
