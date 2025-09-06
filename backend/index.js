const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Auth routes ko use karo
app.use('/api/auth', require('./routes/authRoutes'));
// Items routes ko use karo
app.use('/api/items', require('./routes/itemRoutes'));

app.get('/', (req, res) => res.send('API is running...'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));