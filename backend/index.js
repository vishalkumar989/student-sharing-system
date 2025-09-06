const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration (YAHI HAI ASLI SOLUTION)
const corsOptions = {
  origin: '[https://whimsical-pasca-4db7a3.netlify.app](https://whimsical-pasca-4db7a3.netlify.app)', // <-- Yahan apni Netlify site ka URL daalo
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions)); // CORS ko naye options ke saath use karo

// Middlewares
app.use(express.json());
// Make 'uploads' folder public
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));