
// import { client, pool } from "@/sdk/pool";
// import { toCamelCase } from "@/utils/server/server-functions";
// import { Client, Pool, PoolClient } from "pg";

// export class CarsImagesRepo {
//     static async find() {
//         const { rows } = await pool.query(`SELECT * FROM cars_images`)
//         return toCamelCase(rows)
//     }
//     static async findById(id: number) {
//         const { rows } = await pool.query(`SELECT * FROM cars_images WHERE id = $1`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async insert(url: string, car_id: number, alt_text: string, client: Client | Pool = pool) {
//         const { rows } = await client.query(`INSERT INTO cars_images(url, car_id, alt_text)
//                 VALUES ($1, $2, $3) RETURNING *
//             `, [url, car_id, alt_text])
//         return toCamelCase(rows)[0]
//     }
//     static async insertManyImages(imagesToBeAdded: { url: string, carId: number, altText: string }[]) {
//         await client.connect()
//         try {
//             await client.query(`BEGIN`)
//             const addedImages = await Promise.all(imagesToBeAdded.map(image => {
//                 return this.insert(image.url, image.carId, image.altText, client)
//             }))
//             await client.query(`COMMIT`)

//             return addedImages
//         } catch (e) {
//             await client.query('ROLLBACK')
//             throw e
//         } finally {
//             client.end()
//         }
//     }
//     static async delete(id: number, client: Client | Pool = pool) {
//         const { rows } = await client.query(`DELETE FROM cars_images WHERE id = $1 RETURNING *`, [id])
//         return toCamelCase(rows)[0]
//     }
//     static async deleteManyImages(imagesToBeDeleted: number[]) {
//         await client.connect()
//         try {
//             await client.query(`BEGIN`)
//             const deletedImages = await Promise.all(imagesToBeDeleted.map(async id => {
//                 return this.delete(id, client)
//             }))
//             await client.query(`COMMIT`)

//             return deletedImages
//         } catch (e) {
//             await client.query('ROLLBACK')
//             throw e
//         } finally {
//             client.end()
//         }
//     }
//     static async update(id: number, url: string, car_id: number, alt_text: string, client: Client | Pool = pool) {
//         const { rows } = await pool.query(`UPDATE cars_images SET url = $1, car_id = $2, alt_text = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`, [url, car_id, alt_text, id])
//         return toCamelCase(rows)[0]
//     }
//     static async updateManyImages(imagesToBeUpdated: { id: number, url: string, carId: number, altText: string }[]) {
//         await client.connect()
//         try {
//             await client.query(`BEGIN`);
//             const updatedImages = Promise.all(imagesToBeUpdated.map(image => {
//                 return this.update(image.id, image.url, image.carId, image.altText, client)
//             }))
//             await client.query('COMMIT')
//             return updatedImages
//         } catch (e) {
//             await client.query(`ROLLBACK`)
//             throw e

//         } finally {
//             client.end()
//         }
//     }
// }