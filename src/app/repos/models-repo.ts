// import { pool } from "@/sdk/pool";
// import {toCamelCase} from "@/utils/server/server-functions"
// export class ModelRepo {
//     static async find() {
//         const { rows } = await pool.query(`SELECT models.*, brands.name AS brand_name FROM models LEFT JOIN brands ON models.brand_id = brands.id `)
//         return toCamelCase(rows)
//     }
//     static async findById(id: number) {
//         const { rows } = await pool.query(`SELECT models.*, brands.name AS brand_name FROM models LEFT JOIN brands ON models.brand_id = brands.id WHERE models.id = $1 `, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async findByBrand(brand_id: number) {
//         const { rows } = await pool.query(`SELECT models.*, brands.name AS brand_name FROM models LEFT JOIN brands ON models.brand_id = brands.id WHERE models.brand_id = $1`, [brand_id])
//         return toCamelCase(rows)
//     }
//     static async findByBodyType(body_type: string) {
//         const { rows } = await pool.query(`SELECT models.*, brands.name AS brand_name FROM models LEFT JOIN brands ON models.brand_id = brands.id WHERE models.body_type = $1`, [body_type])
//         return toCamelCase(rows)
//     }
//     static async findByProductionYear(production_year: number) {
//         const { rows } = await pool.query(`SELECT models.*, brands.name AS brand_name FROM models LEFT JOIN brands ON models.brand_id = brands.id WHERE models.production_year = $1`, [production_year])
//         return toCamelCase(rows)
//     }
//     static async findByTransmission(transmission: 'automatic' | 'manual') {
//         const { rows } = await pool.query(`SSELECT models.*, brands.name AS brand_name FROM models LEFT JOIN brands ON models.brand_id = brands.id WHERE models.transmission = $1`, [transmission])
//         return toCamelCase(rows)
//     }
//     static async insert(name: string, brand_id: number, body_type: string, production_year: number, transmission: 'automatic' | 'manual') {
//         const { rows } = await pool.query(`
//             INSERT INTO models(name, brand_id, body_type, production_year, transmission)
//             VALUES($1, $2, $3, $4, $5) RETURNING *`,
//             [name, brand_id, body_type, production_year, transmission]
//         )
//         return toCamelCase(rows)[0]
//     }
//     static async update(id:number, name: string, brand_id: number, body_type: string, production_year: number, transmission: 'automatic' | 'manual'){
//         const {rows} = await pool.query(`UPDATE models SET name = $1, brand_id = $2, body_type = $3, production_year = $4, transmittion = $5 WHERE id = $6 RETURNING *`,[name, brand_id, body_type, production_year, transmission, id])
//         return toCamelCase(rows)[0]
//     }
//     static async delete(id: number) {
//         const { rows } = await pool.query(`DELETE FROM models WHERE id = $1 RETURNING *`, [id])
//         return toCamelCase(rows)[0]
//     }
// }