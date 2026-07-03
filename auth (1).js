require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const shortsRoutes = require('./routes/shorts');
const socialRoutes = require('./routes/social');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Too many requests. Please wait 15 minutes.' }
}));

// ── ROUTES ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/social', socialRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', app: 'SnipShort.Online' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

// ── AUTO-CREATE OWNER ACCOUNT ─────────────────────────
async function createOwner() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: process.env.OWNER_EMAIL || 'owner@snipshort.online' }
    });
    if (!existing) {
      const hashed = await bcrypt.hash(process.env.OWNER_PASSWORD || 'snipshort2026', 12);
      await prisma.user.create({
        data: {
          name: process.env.OWNER_NAME || 'Owner',
          email: process.env.OWNER_EMAIL || 'owner@snipshort.online',
          password: hashed,
          role: 'OWNER',
          plan: 'AGENCY'
        }
      });
      console.log('✅ Owner account created:', process.env.OWNER_EMAIL);
    }
  } catch (err) {
    console.error('Owner creation error:', err.message);
  }
}

// ── START ─────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 SnipShort Backend running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  await createOwner();
});

module.exports = app;
