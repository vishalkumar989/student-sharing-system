const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for Local Development
app.use(cors());

// Middlewares
app.use(express.json());

// Make 'uploads' folder public (YAHI HAI ASLI SOLUTION)
// Yeh Express ko batata hai ki 'uploads' folder ke andar ki files ko public access de do.
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));