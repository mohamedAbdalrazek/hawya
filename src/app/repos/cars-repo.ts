import { pool } from "@/sdk/pool";
import { toCamelCase } from "@/utils/server/server-functions";

export class CarsRepo {
    static async find() {
        const { rows } = await pool.query(`SELECT cars.*, models.name AS model_name, models.body_type, models.transmission, models.production_year, brands.name AS brand_name FROM cars LEFT JOIN models ON cars.model_id = models.id LEFT JOIN brands ON models.brand_id = brands.id`)
        return toCamelCase(rows)
    }
    static async findById(id:number) {
        const { rows } = await pool.query(`SELECT cars.*, models.name AS model_name, models.body_type, models.transmission, models.production_year, brands.name AS brand_name FROM cars LEFT JOIN models ON cars.model_id = models.id LEFT JOIN brands ON models.brand_id = brands.id WHERE cars.id = $1`, [id])
        return toCamelCase(rows)
    }
    static async insert(model_id: number, car_color: string, price_per_day: number, price_per_month: number) {
        const { rows } = await pool.query(`INSERT INTO cars (model_id, car_color, price_per_day, price_per_month) VALUES ($1, $2, $3, $4) RETURNING *`, [model_id, car_color, price_per_day, price_per_month])
        return toCamelCase(rows)[0]
    }
    static async delete (id:number){
        const {rows} = await pool.query(`DELETE FROM cars WHERE id = $1 RETURNING *`, [id])
        return toCamelCase(rows)[0]
    }
}