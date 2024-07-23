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
            // Check if user already exists
            const userExists = await query('SELECT * FROM users WHERE email = ?', [email]);
            if (userExists.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Insert new user into the database
            await query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        // Validate email
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        try {
            // Check if user exists
            const user = await query('SELECT * FROM users WHERE email = ?', [email]);
            if (user.length === 0) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Compare passwords
            const validPassword = await bcrypt.compare(password, user[0].password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    logout: (req, res) => {
        // Invalidate the token (handled client-side by deleting the token)
        res.status(200).json({ message: 'Logout successful' });
    },
};

export default userControllers;
