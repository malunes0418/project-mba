import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorResponse } from '../helpers/ApiResponseHelper';

dotenv.config();

export interface JwtPayload {
  id: string;
  email: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    res.status(401).json(errorResponse('No token, authorization denied'));
    return;
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    // req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json(errorResponse('Token is not valid'));
    return;
  }
};
