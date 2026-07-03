const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized. No token.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, plan: true }
    });

    if (!user) return res.status(401).json({ error: 'User not found.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const ownerOnly = (req, res, next) => {
  if (req.user?.role !== 'OWNER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Owner access required.' });
  }
  next();
};

module.exports = { protect, ownerOnly };
