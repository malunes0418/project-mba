import express, { Request, Response } from 'express';
import { retrieveConfidence, retrieveConfidence2024, retrieveCoOccurrence, retrieveCoOccurrence2024, retrieveGroupedTransactions, retrieveGroupedTransactions2024, retrieveItemPairAnalysis, retrieveLift, retrieveLift2024, retrieveSalesPerMonth, retrieveSalesPerMonth2024, retrieveSupport, retrieveSupport2024, retrieveVitarichTransactions2024, retrieveVRTransactions, retrieveSalesPerWeek2024, retrieveItemPairAnalysisSort, retrieveItemPairAnalysisFINAL, retrieveCombinedItemPairAnalysis, retrievePairCountItemPairAnalysis, retrieveProductCountAnalysis } from '../controllers/mbaController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// #region OLD DATA
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

router.get('/SalesPerMonth', protect, async (req: Request, res: Response) => {
  try {
    await retrieveSalesPerMonth(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});
// #endregion
// #region NEW DATA
router.get('/VitarichTransactions2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveVitarichTransactions2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/GroupedTransactions2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveGroupedTransactions2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/CoOccurrence2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveCoOccurrence2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/Support2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveSupport2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/Confidence2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveConfidence2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/Lift2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveLift2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/SalesPerMonth2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveSalesPerMonth2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/ItemPairAnalysis', protect, async (req: Request, res: Response) => {
  try {
    await retrieveItemPairAnalysis(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/ItemPairAnalysisSort', protect, async (req: Request, res: Response) => {
  try {
    await retrieveItemPairAnalysisSort(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/SalesPerWeek2024', protect, async (req: Request, res: Response) => {
  try {
    await retrieveSalesPerWeek2024(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/ItemPairAnalysisFINAL/:dataset', protect, async (req: Request, res: Response) => {
  try {
    await retrieveItemPairAnalysisFINAL(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/CombinedItemPairAnalysis', protect, async (req: Request, res: Response) => {
  try {
    await retrieveCombinedItemPairAnalysis(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/PairCountItemPairAnalysis', protect, async (req: Request, res: Response) => {
  try {
    await retrievePairCountItemPairAnalysis(req, res);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/ProductCountAnalysis', protect, async (req, res) => {
  try {
      await retrieveProductCountAnalysis(req, res);
  } catch (error) {
      res.status(500).send(error);
  }
});
// #endregion

export default router;
