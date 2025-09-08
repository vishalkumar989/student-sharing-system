const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for Production: Only allow requests from your Vercel frontend
const corsOptions = {
  origin: 'https://student-sharing-system-42sd.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


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