// /**
//  * @jest-environment node
//  */
// import  {GET} from "@/app/api/brands/route";
// import request from 'supertest';
// import { pool } from "@/sdk/pool";
// beforeAll = async () => {
//     await pool.connect()
// }
// afterAll = async () => {
//     await pool.end()
// }
// describe('brands API', () => {
//     it('should return a list of brands', async () => {
//         const response = await request(GET) // Pass the handler function directly
//             .get('/api/brands/route.ts')
//              // The path here is relative to the handler's internal logic
//         expect(response.statusCode).toBe(200);
//     });
// });