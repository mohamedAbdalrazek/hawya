exports.shorthands = undefined;

exports.up = (pgm) => {

    pgm.sql(`
        CREATE TYPE transmissions_types AS ENUM ('automatic','manual');
        CREATE TABLE models (
            id SERIAL PRIMARY KEY,
            brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
            name VARCHAR(40) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            body_type VARCHAR(40) NOT NULL,
            production_year INTEGER NOT NULL CHECK (production_year > 1990),    
            transmission transmissions_types NOT NULL
        )
        `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE models;
        DROP TYPE transmissions_types;
    `);
};
