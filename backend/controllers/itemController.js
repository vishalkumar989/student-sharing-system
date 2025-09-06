const db = require('../config/db');

// Sabhi items ko fetch karne ka logic
exports.getAllItems = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT items.*, users.name AS seller_name 
             FROM items 
             JOIN users ON items.seller_id = users.id 
             WHERE items.status = 'available' 
             ORDER BY items.created_at DESC`
        );
        
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// Naya item create karne ka logic
exports.createItem = async (req, res) => {
    const { name, description, price, item_type } = req.body;
    const seller_id = req.user.id; // Yeh ID humein authMiddleware se mil rahi hai

    try {
        // Pehle user ka college_id nikaalo
        const [rows] = await db.query('SELECT college_id FROM users WHERE id = ?', [seller_id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const college_id = rows[0].college_id;

        const [result] = await db.query(
            'INSERT INTO items (name, description, price, item_type, seller_id, college_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, item_type, seller_id, college_id]
        );
        res.status(201).json({ msg: 'Item created successfully', itemId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// Ek single item ko uski ID se fetch karne ka logic
exports.getItemById = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT items.*, users.name AS seller_name, users.email AS seller_email 
             FROM items 
             JOIN users ON items.seller_id = users.id 
             WHERE items.id = ?`,
            [req.params.id] // ID ko URL se lena
        );

        if (items.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        res.json(items[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// Logged-in user ke saare items fetch karne ka logic
exports.getMyItems = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT * FROM items WHERE seller_id = ? ORDER BY created_at DESC`,
            [req.user.id] // ID authMiddleware se aa rahi hai
        );
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Ek item ko delete karne ka logic
exports.deleteItem = async (req, res) => {
    try {
        // Pehle check karo ki jo item delete ho raha hai, woh isi user ka hai ya nahi
        const [items] = await db.query('SELECT seller_id FROM items WHERE id = ?', [req.params.id]);

        if (items.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        const item = items[0];
        if (item.seller_id.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);

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
        // Pehle check karo ki jo item update ho raha hai, woh isi user ka hai ya nahi
        const [items] = await db.query('SELECT seller_id FROM items WHERE id = ?', [req.params.id]);

        if (items.length === 0) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        if (items[0].seller_id.toString() !== req.user.id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Item ko naye data ke saath update karo
        await db.query(
            'UPDATE items SET name = ?, description = ?, price = ?, item_type = ?, status = ? WHERE id = ?',
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
    const query = req.query.q; // URL se search query nikaalo (e.g., ?q=calculator)

    if (!query) {
        return res.status(400).json({ msg: 'Search query is required' });
    }

    try {
        const searchTerm = `%${query}%`; // SQL LIKE query ke liye format
        const [items] = await db.query(
            `SELECT items.*, users.name AS seller_name 
             FROM items 
             JOIN users ON items.seller_id = users.id 
             WHERE items.status = 'available' AND items.name LIKE ?`,
            [searchTerm]
        );
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// Naya item create karne ka logic (with image)
exports.createItem = async (req, res) => {
    const { name, description, price, item_type } = req.body;
    const seller_id = req.user.id;
    const image_url = req.file ? req.file.path : null; // Multer file ka path yahan se milta hai

    try {
        // ... (User ka college_id nikaalne wala code waise hi rahega)
        const [rows] = await db.query('SELECT college_id FROM users WHERE id = ?', [seller_id]);
        if (rows.length === 0) { return res.status(404).json({ msg: 'User not found' }); }
        const college_id = rows[0].college_id;

        const [result] = await db.query(
            'INSERT INTO items (name, description, price, item_type, image_url, seller_id, college_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, item_type, image_url, seller_id, college_id]
        );
        res.status(201).json({ msg: 'Item created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


