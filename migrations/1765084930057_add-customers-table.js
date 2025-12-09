
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        CREATE TABLE customers (
                id SERIAL PRIMARY KEY ,
                customer_name VARCHAR(200) NOT NULL,
                customer_phone VARCHAR(40) NOT NULL,
                customer_id VARCHAR(40) NOT NULL UNIQUE,
                customer_birth_date DATE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `)
};

exports.down = (pgm) => {
    pgm.sql(`DROP TABLE customers`)
};
