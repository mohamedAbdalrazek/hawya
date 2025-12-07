
// exports.shorthands = undefined;


// exports.up = (pgm) => {
//     pgm.sql(`
        
//             CREATE TABLE cars(
//                 id SERIAL PRIMARY KEY,
//                 car_color VARCHAR(30) NOT NULL,
//                 price_per_month NUMERIC(10,2) NOT NULL,
//                 price_per_day NUMERIC(10,2) NOT NULL,
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                 model_id INTEGER REFERENCES models(id) ON DELETE CASCADE NOT NULL
//             );
//         `)
// };

// exports.down = (pgm) => {
//     pgm.sql(`
//             DROP TABLE cars;
//         `)
// };
