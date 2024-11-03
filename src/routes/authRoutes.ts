import express, { Request, Response } from 'express';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController';

const router = express.Router();


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

router.post('/forgotPassword', async (req: Request, res: Response) => {
  try {
    await forgotPassword(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/resetPassword', async (req: Request, res: Response) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
