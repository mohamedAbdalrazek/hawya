import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { createDailyHours } from "./locationHours";
import { LocationMap } from "./types";

function jubailHours() {
    const hours = createDailyHours("08:00", "22:00");
    hours.friday = { closed: false, open: "16:00", close: "22:00" };
    return hours;
}

export const SEED_LOCATIONS: LocationMap[] = [
    {
        id: "al-mazruiyah",
        name: { en: "Al Mazruiyah", ar: "المزروعية" },
        address: {
            en: "Prince Mohammed Bin Fahd Road, Al Mazruiyah, Dammam",
            ar: "طريق الأمير محمد بن فهد، المزروعية، الدمام",
        },
        phone: "055 844 3343",
        hours: createDailyHours("08:00", "22:00"),
        lat: 26.443338,
        lng: 50.118291,
        sortOrder: 1,
    },
    {
        id: "prince-nayef",
        name: { en: "Prince Nayef Bin Abdulaziz", ar: "الأمير نايف بن عبدالعزيز" },
        address: {
            en: "Prince Nayef Bin Abdulaziz Rd, Al Itisalat, Dammam",
            ar: "طريق الأمير نايف بن عبدالعزيز، الاتصالات، الدمام",
        },
        phone: "050 349 9984",
        hours: createDailyHours("08:00", "22:00"),
        lat: 26.407699,
        lng: 50.0702526,
        sortOrder: 2,
    },
    {
        id: "jubail",
        name: { en: "Jubail", ar: "الجبيل" },
        address: {
            en: "Al Madinah Al Mounawwarah, Jubail City Center, Al Jubail",
            ar: "طريق المدينة المنورة، مركز مدينة الجبيل، الجبيل",
        },
        phone: "0554987729",
        hours: jubailHours(),
        lat: 27.004798,
        lng: 49.656452,
        sortOrder: 3,
    },
    {
        id: "al-zuhur",
        name: { en: "Al Zuhur", ar: "الزهور" },
        address: {
            en: "18th Street, Al Zuhur, Dammam",
            ar: "الشارع 18، الزهور، الدمام",
        },
        phone: "0597185688",
        hours: createDailyHours("08:00", "23:00"),
        lat: 26.455581,
        lng: 50.096408,
        sortOrder: 4,
    },
];

export async function ensureLocationsSeeded(): Promise<void> {
    const metaRef = firestoreAdmin.collection("_meta").doc("locations");
    const meta = await metaRef.get();
    if (meta.exists && meta.data()?.seeded === true) {
        return;
    }

    const batch = firestoreAdmin.batch();
    const existing = await firestoreAdmin.collection("locations").limit(1).get();
    if (existing.empty) {
        for (const location of SEED_LOCATIONS) {
            const { id, ...data } = location;
            batch.set(firestoreAdmin.collection("locations").doc(id), data);
        }
    }
    batch.set(metaRef, { seeded: true }, { merge: true });
    await batch.commit();
}
