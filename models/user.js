import query from '../config/db.js';

const createUserTable = async () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    try {
        await query(createTableSQL);
        console.log('Users table created successfully');
    } catch (err) {
        console.error('Error creating users table:', err);
    }
};

export default createUserTable;
