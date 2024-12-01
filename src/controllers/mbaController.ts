import { Request, Response } from 'express';
import { MBAManager } from '../managers/mbaManager';
import { TransactionsRequest } from '../models/Transaction/transactionRequest';

// #region OLD DATA
export const retrieveVRTransactions = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveVRTransactions(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveGroupedTransactions = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveGroupedTransactions(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveCoOccurrence = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveCoOccurrence(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveSupport = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveSupport(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveConfidence = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveConfidence(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveLift = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveLift(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveSalesPerMonth = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveSalesPerMonth(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};
// #endregion

// #region NEW DATA
export const retrieveVitarichTransactions2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveVitarichTransactions2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveGroupedTransactions2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveGroupedTransactions2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveCoOccurrence2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveCoOccurrence2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveSupport2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveSupport2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveConfidence2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveConfidence2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveLift2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveLift2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveSalesPerMonth2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveSalesPerMonth2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveItemPairAnalysis = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveItemPairAnalysis(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveItemPairAnalysisSort = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveItemPairAnalysisSort(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveSalesPerWeek2024 = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  
  const response = await manager.retrieveSalesPerWeek2024(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveItemPairAnalysisFINAL = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;
  const dataset = req.params.dataset;

  if (!dataset || !['VT_DATASET_2024', 'VT_DATASET_2023'].includes(dataset)) {
    return res.status(400).json({ isSuccess: false, message: 'Invalid dataset specified' });
  }

  const response = await manager.retrieveItemPairAnalysisFINAL(requestQuery, dataset);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveCombinedItemPairAnalysis = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  const response = await manager.retrieveCombinedItemPairAnalysis(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrievePairCountItemPairAnalysis = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  const response = await manager.retrievePairCountItemPairAnalysis(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

export const retrieveProductCountAnalysis = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  const response = await manager.retrieveProductCountAnalysis(requestQuery);

  if (response.isSuccess) {
      return res.status(200).json(response);
  } else {
      return res.status(500).json({ isSuccess: false, message: response.message });
  }
};

// #endregion