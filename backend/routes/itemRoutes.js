const db = require('../config/db');

// Sabhi items ko fetch karne ka logic
exports.getAllItems = async (req, res) => {
    try {
        // FIX: Changed from [items] to { rows } to work with PostgreSQL
        const { rows } = await db.query(
            `SELECT items.*, users.name AS seller_name 
             FROM items 
             JOIN users ON items.seller_id = users.id 
             WHERE items.status = 'available' 
             ORDER BY items.created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Naya item create karne ka logic (with image)
exports.createItem = async (req, res) => {
    const { name, description, price, item_type } = req.body;
    const seller_id = req.user.id;
    const image_url = req.file ? req.file.path : null;

    try {
        // FIX: Changed from [rows] to userResult and use userResult.rows
        const userResult = await db.query('SELECT college_id FROM users WHERE id = $1', [seller_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const college_id = userResult.rows[0].college_id;
        
        // FIX: Changed from [result] to itemResult and use itemResult.rows
        const itemResult = await db.query(
            'INSERT INTO items (name, description, price, item_type, image_url, seller_id, college_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [name, description, price, item_type, image_url, seller_id, college_id]
        );
        res.status(201).json({ msg: 'Item created successfully', itemId: itemResult.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Ek single item ko uski ID se fetch karne ka logic
exports.getItemById = async (req, res) => {
    try {
        // FIX: Changed from [items] to { rows }
        const { rows } = await db.query(
            `SELECT items.*, users.name AS seller_name, users.email AS seller_email 
             FROM items 
             JOIN users ON items.seller_id = users.id 
             WHERE items.id = $1`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Logged-in user ke saare items fetch karne ka logic
exports.getMyItems = async (req, res) => {
    try {
        // FIX: Changed from [items] to { rows }
        const { rows } = await db.query(
            `SELECT * FROM items WHERE seller_id = $1 ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Ek item ko delete karne ka logic
exports.deleteItem = async (req, res) => {
    try {
        // FIX: Changed from [items] to { rows }
        const { rows } = await db.query('SELECT seller_id FROM items WHERE id = $1', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        const item = rows[0];
        if (item.seller_id.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await db.query('DELETE FROM items WHERE id = $1', [req.params.id]);

        res.json({ msg: 'Item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Ek item ko update karne ka logic
exports.updateItem = async (req, res) => {
    const { name, description, price, item_type, status } = req.body;
    try {
        // FIX: Changed from [items] to { rows }
        const { rows } = await db.query('SELECT seller_id FROM items WHERE id = $1', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        if (rows[0].seller_id.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        
        await db.query(
            'UPDATE items SET name = $1, description = $2, price = $3, item_type = $4, status = $5 WHERE id = $6',
            [name, description, price, item_type, status, req.params.id]
        );

        res.json({ msg: 'Item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Items ko naam se search karne ka logic
exports.searchItems = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ msg: 'Search query is required' });
    }

    try {
        const searchTerm = `%${query}%`;
        // FIX: Changed from [items] to { rows } and LIKE to ILIKE
        const { rows } = await db.query(
            `SELECT items.*, users.name AS seller_name 
             FROM items 
             JOIN users ON items.seller_id = users.id 
             WHERE items.status = 'available' AND items.name ILIKE $1`,
            [searchTerm]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};