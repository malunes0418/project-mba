import express, { Request, Response } from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();

// Auth routes
router.post('/signup', async (req: Request, res: Response) => {
  try {
    await signup(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    await login(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
