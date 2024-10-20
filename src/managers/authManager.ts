import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User/userModel';
import { successResponse, errorResponse } from '../helpers/ApiResponseHelper';

dotenv.config();

export class authManager {
  /**
   * Handles user signup logic.
   * @param name - The name of the user
   * @param email - The email of the user
   * @param password - The user's password
   * @returns {Promise<ApiResponse>} - The signup result
   */
  public async signup(name: string, email: string, password: string) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({ name, email, password: hashedPassword });

      // Create JWT token
      const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRES });

      return successResponse('User created successfully', { token });
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error.message);
    }
  }

  /**
   * Handles user login logic.
   * @param email - The user's email
   * @param password - The user's password
   * @returns {Promise<ApiResponse>} - The login result
   */
  public async login(email: string, password: string) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse('Invalid credentials');
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse('Invalid credentials');
      }

      // Create JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRES });

      return successResponse('Login successful', { token });
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error.message);
    }
  }
}
