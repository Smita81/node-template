import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';
import query from '../config/db.js';

const userControllers = {
    register: async (req, res) => {
        const { email, password, confirmPassword } = req.body;

        // Validate email
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password does not meet criteria' });
        }

        // Check if passwords match
        if (!matchPasswords(password, confirmPassword)) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        try {
            // Check if user exists
            const existingUser = await query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Save user to database
            await query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

            // Generate JWT token
            const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

            // Send response
            return res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Check if user exists
            const user = await query('SELECT * FROM users WHERE email = ?', [email]);
            if (user.length === 0) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, user[0].password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

            // Send response
            return res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    logout: async (req, res) => {
        // Invalidate token logic can be implemented here, such as adding the token to a blacklist

        // For now, just send a response
        return res.status(200).json({ message: 'Logout successful' });
    },
};

export default userControllers;
