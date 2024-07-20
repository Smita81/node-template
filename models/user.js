import query from '../config/db.js';

const createUserTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await query(createTableQuery);
        console.log('User table created successfully or already exists.');
    } catch (err) {
        console.error('Error creating user table:', err.message);
    }
};

export default createUserTable;
