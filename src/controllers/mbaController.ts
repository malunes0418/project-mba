import { Request, Response } from 'express';
import { MBAManager } from '../managers/mbaManager';
import { TransactionsRequest } from '../models/Transaction/transactionRequest';

export const retrieveVRTransactions = async (req: Request, res: Response): Promise<Response> => {
  const manager = new MBAManager();
  const requestQuery: TransactionsRequest = req.query;

  // Call the manager to retrieve VR transactions
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

  // Call the manager to retrieve VR transactions
  const response = await manager.retrieveGroupedTransactions(requestQuery);

  if (response.isSuccess) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({ isSuccess: false, message: response.message });
  }
};