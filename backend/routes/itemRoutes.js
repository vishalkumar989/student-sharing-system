const express = require('express');
const router = express.Router();
const { 
    getAllItems, 
    createItem, 
    getItemById, 
    getMyItems, 
    deleteItem, 
    updateItem, 
    searchItems 
} = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Images 'backend/uploads/' folder me save hongi
    },
    filename: function (req, file, cb) {
        // Har file ko ek unique naam do taaki same naam ki files overwrite na ho
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Multer ka instance banao
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: function (req, file, cb) {
        // Sirf image files (jpeg, png, etc.) ko allow karo
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
});

// PUBLIC ROUTES
router.get('/search', searchItems);
router.get('/', getAllItems);
router.get('/:id', getItemById);

// PRIVATE ROUTES (Token Zaroori Hai)
// `upload.single('image')` middleware form me se 'image' naam ki file ko nikalega
router.post('/', authMiddleware, upload.single('image'), createItem);
router.get('/user/my-items', authMiddleware, getMyItems);
router.delete('/:id', authMiddleware, deleteItem);
router.put('/:id', authMiddleware, upload.single('image'), updateItem);

module.exports = router;
