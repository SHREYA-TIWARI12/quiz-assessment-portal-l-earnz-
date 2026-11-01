import jwt from 'jsonwebtoken';
export const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
export const userDto = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });
