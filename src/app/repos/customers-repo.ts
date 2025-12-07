// import { pool } from "@/sdk/pool";
// import { toCamelCase } from "@/utils/server/server-functions";

// export class CustomersRepo {
//     static async find() {
//         const { rows } = await pool.query(`SELECT * FROM customers`)
//         return toCamelCase(rows)
//     }
//     static async findById(id: number) {
//         const { rows } = await pool.query(`SELECT * FROM customers WHERE id =$1`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async insert(customer_name: string, customer_phone: string, customer_id: string, customer_birth_date: Date) {
//         const { rows } = await pool.query(`INSERT INTO customers(customer_name, customer_phone, customer_id, customer_birth_date) RETURNING *`, [customer_name, customer_phone, customer_id, customer_birth_date])
//         return toCamelCase(rows)[0]
//     }
//     static async delete(id: number) {
//         const { rows } = await pool.query(`DELETE FROM customers WHERE id = $1 RETURNING *`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async update(id: number, customer_name: string, customer_phone: string, customer_id: string, customer_birth_date: Date) {
//         const { rows } = await pool.query(`UPDATE customers SET customer_name = $1, customer_phone = $2, customer_id $3, customer_birth_date $4 WHERE id = $5 RETURNING *`, [customer_name, , customer_phone, customer_id, customer_birth_date, id])
//         return toCamelCase(rows)[0]

//     }
// }