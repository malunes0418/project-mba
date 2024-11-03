import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/DB Models/userModel';
import { successResponse, errorResponse } from '../helpers/ApiResponseHelper';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail';
import { Op } from 'sequelize';

dotenv.config();

export class authManager {
  public async signup(name: string, email: string, password: string) {
    try {
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse('User already exists');
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const newUser = await User.create({ name, email, password: hashedPassword, createdAt: new Date(), updatedAt: new Date() });

      
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

  public async forgotPassword(email: string) {
    try {
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse('Invalid email!');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      await user.update({
        resetToken,
        resetTokenExpires: new Date(Date.now() + 3600000 + 8 * 60 * 60 * 1000),// save at GMT +8
      });

      const emailSubject = 'Password Reset Request';
      const emailBody = `
        <p>You requested a password reset</p>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password. This link will expire in 1 hour.</p>
      `;

      await sendEmail(email, emailSubject, emailBody);

      return successResponse('Email sent with password reset link');
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error.message);
    }
  }

  public async resetPassword(token: string, newPassword: string) {
    try {
      
      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpires: { [Op.gt]: new Date() }, // check token expiry
        },
      });
  
      if (!user) {
        return errorResponse('Invalid or expired token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await user.update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      });

      return successResponse('Password reset successful');
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error.message);
    }
  }
}
