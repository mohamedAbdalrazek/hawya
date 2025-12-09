import { Client, Pool } from 'pg'
export const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || "5432")
})
export const client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || "5432")
})