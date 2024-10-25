import express, { Request, Response } from 'express';
import { retrieveConfidence, retrieveCoOccurrence, retrieveGroupedTransactions, retrieveLift, retrieveSupport, retrieveVRTransactions } from '../controllers/mbaController';
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

router.get('/CoOccurrence', protect, async (req: Request, res: Response) => {
  try {
    await retrieveCoOccurrence(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/Support', protect, async (req: Request, res: Response) => {
  try {
    await retrieveSupport(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/Confidence', protect, async (req: Request, res: Response) => {
  try {
    await retrieveConfidence(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/Lift', protect, async (req: Request, res: Response) => {
  try {
    await retrieveLift(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
