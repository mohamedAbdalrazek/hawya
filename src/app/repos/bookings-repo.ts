// import { pool } from "@/sdk/pool";
// import { toCamelCase } from "@/utils/server/server-functions";

// export class BookingsTable {
//     static async find() {
//         const { rows } = await pool.query(`SELECT * FROM bookings`)
//         return toCamelCase(rows)
//     }
//     static async findById(id: number) {
//         const { rows } = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async insert(car_id: number, customer_id: number, rental_type: "daily" | "monthly", start_data: Date, end_date: Date, rental_period: number) {
//         const { rows } = await pool.query(
//             `
//             INSERT INTO bookings(car_id, customer_id, rental_type, start_date, end_date, rental_period)
//             VALUES($1,$2,$3,$4,$5,$6) RETURNING *
//             `, [car_id, customer_id, rental_type, start_data, end_date, rental_period])
//         return toCamelCase(rows)[0]
//     }
//     static async update(id: number, car_id: number, customer_id: number, rental_type: "daily" | "monthly", start_data: Date, end_date: Date, rental_period: number) {
//         const { rows } = await pool.query(`UPDATE bookings SET car_id = $1, customer_id=$2, rental_type = $3, start_date = $4, end_date = $5, rental_preiod=$6, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETUNRING *`, [car_id, customer_id, rental_type, start_data, end_date, rental_period, id])
//         return toCamelCase(rows)[0]
//     }
//     static async delete(id:number){
//         const{rows} = await pool.query(`DELETE FROM bookings WHERE id = $1 RETURNING *`,[id])
//         return toCamelCase(rows)[0]
//     }
// }