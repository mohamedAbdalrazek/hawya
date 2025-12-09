exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        CREATE TABLE brands(
            id SERIAL PRIMARY KEY,
            name VARCHAR(40) NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE brands
        `);
};

