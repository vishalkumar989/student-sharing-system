const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Local Vite frontend
    "https://student-sharing-system-42sd.vercel.app", // Production main domain
    "https://student-sharing-system-42sd-git-master-visha-kumars-projects.vercel.app" // Vercel preview deployment
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middlewares
app.use(express.json());

// ✅ Make 'uploads' folder public for image access
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// ✅ Test Route
app.get('/', (req, res) => res.send('API is running...'));

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
