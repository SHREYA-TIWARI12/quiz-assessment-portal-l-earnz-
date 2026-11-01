import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
  try { const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]; if (!token) throw new Error(); const { id } = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(id); if (!req.user) throw new Error(); next(); } catch { res.status(401).json({ message: 'Authentication required.' }); }
};
export const adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Administrator access required.' });
