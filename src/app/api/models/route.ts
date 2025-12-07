import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({message:"testing"})
}
// import { ModelRepo } from "@/app/repos/models-repo";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         const models = await ModelRepo.find()
//         return NextResponse.json(models, { status: 200 })
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
//     if (!data.name || !data.brandId || !data.bodyType || !data.productionYear || !data.transmission) {
//         return NextResponse.json({ error: "Some required data are missing" }, { status: 400 })
//     }
//     try {
//         const model = await ModelRepo.insert(data.name, data.brandId, data.bodyType, data.productionYear, data.transmission)
//         return NextResponse.json(model, { status: 201 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: "Something went wrong in the server side" }, { status: 500 })

//     }
// }