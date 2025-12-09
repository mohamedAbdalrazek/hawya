// import { pool } from "@/sdk/pool";
// import { toCamelCase } from "@/utils/server/server-functions";

// export class BrandsRepo {
//     static async find() {
//         const { rows } = await pool.query(`SELECT * FROM brands`)
//         return toCamelCase(rows)
//     }
//     static async insert(name:string){
//         const {rows} = await pool.query(`INSERT INTO brands(name) VALUES($1) RETURNING *`, [name])
//         return toCamelCase(rows)[0]
//     }
//     static async update(id: number, name: string) {
//         const { rows } = await pool.query(`UPDATE brands SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`, [name, id])
//         return toCamelCase(rows)[0]
//     }
//     static async delete(id:number){
//         const{rows} = await pool.query(`DELETE FROM brands WHERE id = $1 RETURNING *`,[id])
//         return toCamelCase(rows)[0]
//     }
//     static async count(){
//         const {rows} = await pool.query(`SELECT COUNT(*) FROM brands`)
//         return toCamelCase(rows)[0].count
//     }
// }