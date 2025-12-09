// import { pool } from "@/sdk/pool";
// import { toCamelCase } from "@/utils/server/server-functions";

// export class MessagesRepo {
//     static async find() {
//         const { rows } = await pool.query(`SELECT * FROM messages`)
//         return toCamelCase(rows)
//     }
//     static async findById(id: number) {
//         const { rows } = await pool.query(`SELECT * FROM messages WHERE id = $1`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async insert(name: string, email: string, phone: string, subject: string, message: string) {
//         const { rows } = await pool.query(`
//             INSERT INTO message(name, email, phone, subject, message)
//             VALUES($1, $2, $3, $4, $5) RETURNING *;
//             `, [name, email, phone, subject, message])
//         return toCamelCase(rows)[0]
//     }
//     static async delete(id: number) {
//         const { rows } = await pool.query(`DELETE FROM messages WHERE id = $1 RETURNING *`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async update(id: number, name: string, email: string, phone: string, subject: string, message: string) {
//         const { rows } = await pool.query(`
//             UPDATE message SET name = $1, email=$2, phone = $3, subject = $4, message=$5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *
//             `, [name, email, phone, subject, message, id])
//         return toCamelCase(rows)[0]
//     }
// }