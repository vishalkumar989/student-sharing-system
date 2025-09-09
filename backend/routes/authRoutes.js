const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    // Note: Assuming you have added college_id to your register form
    const { name, email, password, college_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const q = 'INSERT INTO users(name, email, password, college_id) VALUES($1, $2, $3, $4) RETURNING id, name, email, college_id';
        const values = [name, email, hashedPassword, college_id];
        const { rows } = await db.query(q, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const q = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(q, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getMe = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT id, name, email, college_id FROM users WHERE id = $1', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};