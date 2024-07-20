import query from '../config/db.js';

const createRecipeTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    try {
        await query(createTableQuery);
        console.log('Recipes table created successfully');
    } catch (err) {
        console.error('Error creating recipes table:', err);
    }
};

export default createRecipeTable;
