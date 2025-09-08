const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for Production: Only allow requests from your Vercel frontend
const corsOptions = {
  origin: [
    "http://localhost:5173", // for local Vite frontend
    "https://student-sharing-system-42sd.vercel.app", // production main domain
    "https://student-sharing-system-42sd-git-master-visha-kumars-projects.vercel.app" // your Vercel preview deployment
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));


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