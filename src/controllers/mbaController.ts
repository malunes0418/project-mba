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

// #endregion