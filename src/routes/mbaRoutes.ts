import express, { Request, Response } from 'express';
import { retrieveGroupedTransactions, retrieveVRTransactions } from '../controllers/mbaController';
import { protect } from '../middleware/authMiddleware'; // Import the protect middleware

const router = express.Router();

router.get('/VRTransactions', protect, async (req: Request, res: Response) => {
  try {
    await retrieveVRTransactions(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/GroupedTransactions', protect, async (req: Request, res: Response) => {
  try {
    await retrieveGroupedTransactions(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
