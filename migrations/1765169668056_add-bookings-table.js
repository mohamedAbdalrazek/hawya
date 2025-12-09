
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        CREATE TYPE rental_types AS ENUM ('daily','monthly');
        CREATE TABLE bookings(
            id SERIAL PRIMARY KEY,
            car_id INTEGER REFERENCES cars(id) NOT NULL,
            customer_id INTEGER REFERENCES customers(id) NOT NULL,
            rental_type rental_types NOT NULL,
            start_data DATE NOT NULL, 
            end_date DATE NOT NULL,
            rentail_period INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`)
};


exports.down = (pgm) => {
    pgm.sql(
        `
        DROP TABLE bookings;
        DROP TYPE rental_types;
        `
    )
};
