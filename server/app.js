require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const authRoutes       = require('./routes/authRoutes');
const dashboardRoutes  = require('./routes/dashboardRoutes');
const traderRoutes     = require('./routes/traderRoutes');
const depositRoutes    = require('./routes/depositRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const adminRoutes      = require('./routes/adminRoutes');
const errorHandler     = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { message: 'Too many requests, please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many auth attempts, please try again later.' } });

app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',        authLimiter, authRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/traders',     traderRoutes);
app.use('/api/deposits',    depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin',       adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
