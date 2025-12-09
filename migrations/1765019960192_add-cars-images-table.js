
// exports.shorthands = undefined;


// exports.up = (pgm) => {
//     pgm.sql(`
//         CREATE TABLE cars_images(
//             id SERIAL PRIMARY KEY,
//             url VARCHAR(2000) NOT NULL,
//             alt_text VARCHAR(250) NOT NULL ,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE NOT NULL
//     )
//         `)
// };


// exports.down = (pgm) => {
//     pgm.sql(`DROP TABLE cars_images`)
// };
