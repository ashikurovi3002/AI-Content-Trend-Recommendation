import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (userData: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password || '', salt);

  const user = new User({
    ...userData,
    password: hashedPassword,
  });

  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  return { user, token };
};

export const getUserById = async (id: string) => {
  return User.findById(id).select('-password');
};
