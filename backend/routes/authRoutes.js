const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =============================
// REGISTER USER
// =============================
exports.register = async (req, res) => {
    const { name, email, password, college_id } = req.body;

    try {
        // check if user already exists
        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert new user
        const q = `
            INSERT INTO users(name, email, password, college_id) 
            VALUES($1, $2, $3, $4) 
            RETURNING id, name, email, college_id
        `;
        const values = [name, email, hashedPassword, college_id];
        const { rows } = await db.query(q, values);

        // generate token
        const payload = { user: { id: rows[0].id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            msg: 'User registered successfully',
            user: rows[0],
            token,
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// =============================
// LOGIN USER
// =============================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const q = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(q, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = rows[0];

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // create JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            msg: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, college_id: user.college_id },
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// =============================
// GET LOGGED-IN USER
// =============================
exports.getMe = async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT id, name, email, college_id FROM users WHERE id = $1',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('GetMe Error:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
