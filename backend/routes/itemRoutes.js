const db = require('../config/db');

// ✅ Get all available items
exports.getAllItems = async (req, res) => {
    try {
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

// ✅ Create a new item (with image)
exports.createItem = async (req, res) => {
    const { name, description, price, item_type } = req.body;
    const seller_id = req.user.id;
    const image_url = req.file ? req.file.path : null;

    try {
        const userResult = await db.query(
            'SELECT college_id FROM users WHERE id = $1',
            [seller_id]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const college_id = userResult.rows[0].college_id;

        const itemResult = await db.query(
            `INSERT INTO items (name, description, price, item_type, image_url, seller_id, college_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [name, description, price, item_type, image_url, seller_id, college_id]
        );

        res.status(201).json({
            msg: 'Item created successfully',
            itemId: itemResult.rows[0].id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// ✅ Get single item by ID
exports.getItemById = async (req, res) => {
    try {
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

// ✅ Get logged-in user's items
exports.getMyItems = async (req, res) => {
    try {
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

// ✅ Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT seller_id FROM items WHERE id = $1',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        if (rows[0].seller_id.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await db.query('DELETE FROM items WHERE id = $1', [req.params.id]);
        res.json({ msg: 'Item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// ✅ Update an item
exports.updateItem = async (req, res) => {
    const { name, description, price, item_type, status } = req.body;

    try {
        const { rows } = await db.query(
            'SELECT seller_id FROM items WHERE id = $1',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        if (rows[0].seller_id.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await db.query(
            `UPDATE items 
             SET name = $1, description = $2, price = $3, item_type = $4, status = $5 
             WHERE id = $6`,
            [name, description, price, item_type, status, req.params.id]
        );

        res.json({ msg: 'Item updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// ✅ Search items by name
exports.searchItems = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ msg: 'Search query is required' });
    }

    try {
        const searchTerm = `%${query}%`;
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
