import { Sequelize, QueryTypes } from 'sequelize'; // Import QueryTypes directly
import sequelize from '../config/db'; // Your Sequelize instance
import { TransactionsRequest } from '../models/Transaction/transactionRequest';
import { TransactionResponse } from '../models/Transaction/transactionResponse';
import { BaseHelper } from '../helpers/BaseHelper';

export class MBAManager {
  /**
   * Handles retrieving VR Transactions from the database.
   * @param r - The transaction request object containing filters, sorting, pagination, etc.
   * @returns {Promise<TransactionResponse>} - Returns the constructed response.
   */
  public async retrieveVRTransactions(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT vs.VS_REGION AS REGION, 
             vs.VS_CUSTOMER AS CUSTOMER, 
             vs.VS_SALESPERSON AS SALESPERSON, 
             vs.VS_TERMNAME AS TERMNAME, 
             vs.VS_TERMDAYS AS TERMDAYS, 
             vs.VS_INVOICENUMBER AS INVOICENUMBER, 
             vs.VS_ITEMNUMBER AS ITEMNUMBER, 
             vs.VS_DESCRIPTION AS DESCRIPTION, 
             vs.VS_LINEQTY AS LINEQTY, 
             vs.VS_UOM AS UOM, 
             vs.VS_AT50KG AS AT50KG, 
             vs.VS_UNITSELLINGPRICE AS UNITSELLINGPRICE, 
             vs.VS_LINEAMOUNT AS LINEAMOUNT, 
             vs.VS_DISCOUNT AS DISCOUNT, 
             vs.VS_TAXAMOUNT AS TAXAMOUNT, 
             vs.VS_FREIGHTAMOUNT AS FREIGHTAMOUNT, 
             vs.VS_EXTENDEDAMOUNT AS EXTENDEDAMOUNT, 
             vs.VS_CATEGORYSETDESC AS CATEGORYSETDESC, 
             vs.VS_GROUPING AS GROUPING, 
             vs.VS_ITEMSUBGROUP AS ITEMSUBGROUP, 
             vs.VS_GLMONTH AS GLMONTH 
      FROM MBA.VITARICH_SALES vs
      WHERE 1=1
    `;

    // Apply filters, sorting, and pagination
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['INVOICENUMBER', 'CUSTOMER', 'SALESPERSON', 'ITEMNUMBER']);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'CUSTOMER', 'VITARICH_SALES');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    // Use the helper to retrieve and return the response
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveGroupedTransactions(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t.T_INVOICENUMBER AS INVOICENUMBER, 
             GROUP_CONCAT(T_ITEMDESCRIPTION) AS ITEMS
      FROM MBA.TRANSACTIONS t
      GROUP BY t.T_INVOICENUMBER
    `;

    // Apply filters, sorting, and pagination
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['INVOICENUMBER', 'ITEMS']);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'INVOICENUMBER', 'GROUPED_TRANSACTIONS');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    // Use the helper to retrieve and return the response
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveCoOccurrence(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t1.T_ITEMDESCRIPTION AS item1, 
             t2.T_ITEMDESCRIPTION AS item2, 
             COUNT(*) AS frequency
      FROM MBA.TRANSACTIONS t1
      JOIN MBA.TRANSACTIONS t2 ON t1.T_INVOICENUMBER = t2.T_INVOICENUMBER
      WHERE t1.T_ITEMDESCRIPTION < t2.T_ITEMDESCRIPTION
      GROUP BY t1.T_ITEMDESCRIPTION, t2.T_ITEMDESCRIPTION
      HAVING COUNT(*) > 1
    `;

    // Apply filters, sorting, and pagination
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2']);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'frequency', 'CO_OCCURRENCE');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    // Use the helper to retrieve and return the response
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveSupport(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT T_ITEMDESCRIPTION, 
             COUNT(DISTINCT T_INVOICENUMBER) / 
             (SELECT COUNT(DISTINCT T_INVOICENUMBER) FROM MBA.TRANSACTIONS) AS support
      FROM MBA.TRANSACTIONS
      GROUP BY T_ITEMDESCRIPTION
    `;

    // Apply filters, sorting, and pagination
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['T_ITEMDESCRIPTION']);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'support', 'SUPPORT');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    // Use the helper to retrieve and return the response
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveConfidence(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t1.T_ITEMDESCRIPTION AS item1, 
             t2.T_ITEMDESCRIPTION AS item2,
             COUNT(DISTINCT t1.T_INVOICENUMBER) / 
             (SELECT COUNT(DISTINCT T_INVOICENUMBER) FROM MBA.TRANSACTIONS t 
              WHERE t.T_ITEMDESCRIPTION = t1.T_ITEMDESCRIPTION) AS confidence
      FROM MBA.TRANSACTIONS t1
      JOIN MBA.TRANSACTIONS t2 ON t1.T_INVOICENUMBER = t2.T_INVOICENUMBER
      WHERE t1.T_ITEMDESCRIPTION < t2.T_ITEMDESCRIPTION
      GROUP BY t1.T_ITEMDESCRIPTION, t2.T_ITEMDESCRIPTION
    `;

    // Apply filters, sorting, and pagination
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2']);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'confidence', 'CONFIDENCE');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    // Use the helper to retrieve and return the response
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveLift(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t1.T_ITEMDESCRIPTION AS item1, 
             t2.T_ITEMDESCRIPTION AS item2,
             (COUNT(DISTINCT t1.T_INVOICENUMBER) / 
              (SELECT COUNT(DISTINCT T_INVOICENUMBER) FROM MBA.TRANSACTIONS)) /
             ((SELECT COUNT(DISTINCT T_INVOICENUMBER) FROM MBA.TRANSACTIONS t 
               WHERE t.T_ITEMDESCRIPTION = t1.T_ITEMDESCRIPTION) * 
              (SELECT COUNT(DISTINCT T_INVOICENUMBER) FROM MBA.TRANSACTIONS t 
               WHERE t.T_ITEMDESCRIPTION = t2.T_ITEMDESCRIPTION)) AS lift
      FROM MBA.TRANSACTIONS t1
      JOIN MBA.TRANSACTIONS t2 ON t1.T_INVOICENUMBER = t2.T_INVOICENUMBER
      WHERE t1.T_ITEMDESCRIPTION < t2.T_ITEMDESCRIPTION
      GROUP BY t1.T_ITEMDESCRIPTION, t2.T_ITEMDESCRIPTION
    `;

    // Apply filters, sorting, and pagination
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2']);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'lift', 'LIFT');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    // Use the helper to retrieve and return the response
    return await BaseHelper.retrieveResponse(cmdStr);
  }
}
