import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User/userModel';
import { successResponse, errorResponse } from '../helpers/ApiResponseHelper';

dotenv.config();

export class authManager {
  public async signup(name: string, email: string, password: string) {
    try {
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse('User already exists');
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const newUser = await User.create({ name, email, password: hashedPassword });

      
      const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRES });

      return successResponse('User created successfully', { token });
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error.message);
    }
  }

  public async login(email: string, password: string) {
    try {
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse('Invalid credentials');
      }

      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse('Invalid credentials');
      }

      
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRES });

      return successResponse('Login successful', { token });
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error.message);
    }
  }
}
