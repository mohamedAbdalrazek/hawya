exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
        CREATE TYPE messages_subjects AS ENUM('reservation', 'inquiry', 'support', 'feedback');
        CREATE TABLE messages(
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            email VARCHAR(200) NOT NULL,
            phone VARCHAR(40) NOT NULL,
            subject messages_subjects NOT NULL,
            message VARCHAR(4000) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE messages;
        DROP TYPE messages_subjects;
        `)
};
