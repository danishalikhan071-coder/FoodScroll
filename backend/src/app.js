// Server setup
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

app.use(
  cors({
    // BE ko FE server se data sharing krne ke liye
    origin: (origin, callback) => {
      // Allowed origins from environment variable (comma-separated allow)
      const envOrigins = process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
        : [];

      // Default allowed origins for development
      const defaultOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
      ];

      // Combine both
      const allowedOrigins = [...envOrigins, ...defaultOrigins];

      // Normalize origins: lowercase, remove trailing slash
      const normalizeOrigin = (url) => {
        if (!url) return url;
        return url.replace(/\/$/, '').toLowerCase();
      };

      const normalizedOrigin = normalizeOrigin(origin);

      const isAllowed = allowedOrigins.some(
        (allowed) => normalizeOrigin(allowed) === normalizedOrigin
      );

      // Allow requests with no origin (mobile apps, Postman)
      if (isAllowed || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('hello world');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
