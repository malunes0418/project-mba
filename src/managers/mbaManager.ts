import { Sequelize, QueryTypes } from 'sequelize'; 
import sequelize from '../config/db'; 
import { TransactionsRequest } from '../models/Transaction/transactionRequest';
import { TransactionResponse } from '../models/Transaction/transactionResponse';
import { BaseHelper } from '../helpers/BaseHelper';

export class MBAManager {
  // #region Old DATA
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

    
    const filterValue = ['vs.VS_INVOICENUMBER', 'vs.VS_CUSTOMER', 'vs.VS_SALESPERSON', 'vs.VS_ITEMNUMBER'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['invoiceNumber', 'customer', 'salesPerson', 'itemNumber'], filterValue);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'CUSTOMER', 'VITARICH_SALES');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveGroupedTransactions(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t.T_INVOICENUMBER AS INVOICENUMBER, 
             GROUP_CONCAT(T_ITEMDESCRIPTION) AS ITEMS
      FROM MBA.TRANSACTIONS t 
    `;

    
    const filterValue = ['t.T_INVOICENUMBER'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['invoiceNumber'], filterValue);
    }
    cmdStr += ' GROUP BY t.T_INVOICENUMBER ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'INVOICENUMBER', 'GROUPED_TRANSACTIONS');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
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
    `;

    
    const filterValue = ['t1.T_ITEMDESCRIPTION', 't2.T_ITEMDESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2'], filterValue);
    }
    cmdStr += 'GROUP BY t1.T_ITEMDESCRIPTION, t2.T_ITEMDESCRIPTION HAVING COUNT(*) > 1'
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'frequency', 'CO_OCCURRENCE');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveSupport(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT T_ITEMDESCRIPTION, 
             COUNT(DISTINCT T_INVOICENUMBER) / 
             (SELECT COUNT(DISTINCT T_INVOICENUMBER) FROM MBA.TRANSACTIONS) AS support
      FROM MBA.TRANSACTIONS 
    `;

    
    const filterValue = ['T_ITEMDESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['itemName'], filterValue);
    }
    cmdStr += ' GROUP BY T_ITEMDESCRIPTION ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'support', 'SUPPORT');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
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
    `;

    
    const filterValue = ['t1.T_ITEMDESCRIPTION', 't2.T_ITEMDESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2'], filterValue);
    }
    cmdStr += ' GROUP BY t1.T_ITEMDESCRIPTION, t2.T_ITEMDESCRIPTION ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'confidence', 'CONFIDENCE');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
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
    `;

    
    const filterValue = ['t1.T_ITEMDESCRIPTION', 't2.T_ITEMDESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2'], filterValue);
    }
    cmdStr += ' GROUP BY t1.T_ITEMDESCRIPTION, t2.T_ITEMDESCRIPTION ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'lift', 'LIFT');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveSalesPerMonth(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT 
          MONTHNAME(STR_TO_DATE(CONCAT('01-', VS_GLMONTH), '%d-%y-%b')) AS MONTH,
          SUM(CAST(REPLACE(VS_LINEAMOUNT, ',', '') AS DECIMAL(15, 2))) AS TotalSales
      FROM 
          VITARICH_SALES
      WHERE 
          VS_LINEAMOUNT NOT LIKE '-%'
          AND VS_GLMONTH IS NOT NULL 
    `;

    
    const filterValue = ['MONTH'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['MONTH'], filterValue);
    }
    
    cmdStr += ' GROUP BY MONTH ';
    cmdStr += ` ORDER BY STR_TO_DATE(CONCAT('01-', VS_GLMONTH), '%d-%y-%b')`;
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }
  // #endregion
  // #region New DATA
  public async retrieveVitarichTransactions2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT vs.GLDATE AS GLDATE, 
             vs.ORDERNUMBER AS ORDERNUMBER, 
             vs.DRNUMBER AS DRNUMBER, 
             vs.ITEMNUMBER AS ITEMNUMBER, 
             vs.DESCRIPTION AS DESCRIPTION, 
             vs.LINEQTY AS LINEQTY, 
             vs.UNITWEIGHT AS UNITWEIGHT, 
             vs.AT50KG AS AT50KG, 
             vs.UOM AS UOM, 
             vs.UNITSELLINGPRICE AS UNITSELLINGPRICE, 
             vs.DISCOUNT AS DISCOUNT, 
             vs.LINEAMOUNT AS LINEAMOUNT, 
             vs.EXTENDEDAMOUNT AS EXTENDEDAMOUNT, 
             vs.REVENUEAMOUNT AS REVENUEAMOUNT
      FROM MBA.VITARICH_SALES_2024 vs
      WHERE 1=1
    `;

    
    const filterValue = ['vs.ORDERNUMBER', 'vs.ITEMNUMBER', 'vs.GLDATE'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['orderNumber', 'itemNumber', 'glDate'], filterValue);
    }
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'GLDATE', 'VITARICH_SALES_2024');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveGroupedTransactions2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT ORDERNUMBER AS ORDERNUMBER, 
             GROUP_CONCAT(DESCRIPTION) AS ITEMS
      FROM MBA.VITARICH_SALES_2024
      WHERE ORDERNUMBER != '0'
    `;

    
    const filterValue = ['ORDERNUMBER'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['orderNumber'], filterValue);
    }
    cmdStr += ' GROUP BY ORDERNUMBER ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'ORDERNUMBER', 'GROUPED_TRANSACTIONS_2024');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveCoOccurrence2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t1.DESCRIPTION AS item1, 
             t2.DESCRIPTION AS item2, 
             COUNT(*) AS frequency
      FROM MBA.VITARICH_SALES_2024 t1
      JOIN MBA.VITARICH_SALES_2024 t2 ON t1.ORDERNUMBER = t2.ORDERNUMBER
      WHERE t1.DESCRIPTION < t2.DESCRIPTION 
    `;

    
    const filterValue = ['t1.DESCRIPTION', 't2.DESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2'], filterValue);
    }
    cmdStr += 'GROUP BY t1.DESCRIPTION, t2.DESCRIPTION HAVING COUNT(*) > 1'
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'frequency', 'CO_OCCURRENCE');// reused old sorting
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveSupport2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT DESCRIPTION, 
             COUNT(DISTINCT ORDERNUMBER) / 
             (SELECT COUNT(DISTINCT ORDERNUMBER) FROM MBA.VITARICH_SALES_2024) AS support
      FROM MBA.VITARICH_SALES_2024 
      WHERE ORDERNUMBER != '0'
    `;

    
    const filterValue = ['DESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['itemName'], filterValue);
    }
    cmdStr += ' GROUP BY DESCRIPTION ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'support', 'SUPPORT_2024');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveConfidence2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t1.DESCRIPTION AS item1, 
             t2.DESCRIPTION AS item2,
             COUNT(DISTINCT t1.ORDERNUMBER) / 
             (SELECT COUNT(DISTINCT ORDERNUMBER) FROM MBA.VITARICH_SALES_2024 t 
              WHERE t.DESCRIPTION = t1.DESCRIPTION) AS confidence
      FROM MBA.VITARICH_SALES_2024 t1
      JOIN MBA.VITARICH_SALES_2024 t2 ON t1.ORDERNUMBER = t2.ORDERNUMBER
      WHERE t1.DESCRIPTION < t2.DESCRIPTION AND t1.ORDERNUMBER != '0'
    `;

    
    const filterValue = ['t1.DESCRIPTION', 't2.DESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2'], filterValue);
    }
    cmdStr += ' GROUP BY t1.DESCRIPTION, t2.DESCRIPTION ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'confidence', 'CONFIDENCE');// reused old sorting  
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveLift2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT t1.DESCRIPTION AS item1, 
             t2.DESCRIPTION AS item2,
             (COUNT(DISTINCT t1.ORDERNUMBER) / 
              (SELECT COUNT(DISTINCT ORDERNUMBER) FROM MBA.VITARICH_SALES_2024)) /
             ((SELECT COUNT(DISTINCT ORDERNUMBER) FROM MBA.VITARICH_SALES_2024 t 
               WHERE t.DESCRIPTION = t1.DESCRIPTION) * 
              (SELECT COUNT(DISTINCT ORDERNUMBER) FROM MBA.VITARICH_SALES_2024 t 
               WHERE t.DESCRIPTION = t2.DESCRIPTION)) AS lift
      FROM MBA.VITARICH_SALES_2024 t1
      JOIN MBA.VITARICH_SALES_2024 t2 ON t1.ORDERNUMBER = t2.ORDERNUMBER
      WHERE t1.DESCRIPTION < t2.DESCRIPTION AND t1.ORDERNUMBER != '0'
    `;

    
    const filterValue = ['t1.DESCRIPTION', 't2.DESCRIPTION'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['item1', 'item2'], filterValue);
    }
    cmdStr += ' GROUP BY t1.DESCRIPTION, t2.DESCRIPTION ';
    cmdStr = BaseHelper.determineSort(r, cmdStr, 'lift', 'LIFT');// reused old sorting
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveSalesPerMonth2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT 
          MONTH,
          LINEQTY,
          AT50KG,
          EXTENDEDAMOUNT AS TotalSales
      FROM 
          VITARICH_SUMMARY
    `;

    
    const filterValue = ['MONTH', 'LINEQTY', 'AT50KG'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['MONTH', 'LINEQTY', 'AT50KG'], filterValue);
    }
    
    cmdStr += ' GROUP BY MONTH ';
    cmdStr += ` ORDER BY FIELD(MONTH, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')`;
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  // #endregion
}
