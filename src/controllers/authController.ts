import { Request, Response } from 'express';
import { authManager } from '../managers/authManager';

const manager = new authManager();

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  
  const response = await manager.signup(name, email, password);

  if (response.isSuccess) {
    return res.status(201).json(response);
  } else {
    return res.status(400).json(response);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  
  const response = await manager.login(email, password);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(400).json(response);
  }
};
