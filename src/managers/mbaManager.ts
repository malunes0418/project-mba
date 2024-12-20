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
          CASE SUBSTRING(VS_GLMONTH, 4, 3)
              WHEN 'Jan' THEN 'January'
              WHEN 'Feb' THEN 'February'
              WHEN 'Mar' THEN 'March'
              WHEN 'Apr' THEN 'April'
              WHEN 'May' THEN 'May'
              WHEN 'Jun' THEN 'June'
              WHEN 'Jul' THEN 'July'
              WHEN 'Aug' THEN 'August'
              WHEN 'Sep' THEN 'September'
              WHEN 'Oct' THEN 'October'
              WHEN 'Nov' THEN 'November'
              WHEN 'Dec' THEN 'December'
          END AS MONTH,
          SUM(CASE WHEN CAST(VS_LINEQTY AS SIGNED) >= 0 THEN CAST(VS_LINEQTY AS SIGNED) ELSE 0 END) AS LINEQTY,
          SUM(CASE WHEN CAST(VS_AT50KG AS SIGNED) >= 0 THEN CAST(VS_AT50KG AS SIGNED) ELSE 0 END) AS AT50KG,
          SUM(CASE WHEN CAST(REPLACE(VS_EXTENDEDAMOUNT, ',', '') AS DECIMAL(15, 2)) >= 0 THEN CAST(REPLACE(VS_EXTENDEDAMOUNT, ',', '') AS DECIMAL(15, 2)) ELSE 0 END) AS TotalSales
      FROM 
          VITARICH_SALES
      WHERE 
          CAST(REPLACE(VS_EXTENDEDAMOUNT, ',', '') AS DECIMAL(15, 2)) >= 0
          AND VS_GLMONTH IS NOT NULL
    `;

    const filterValue = ['MONTH'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['MONTH'], filterValue);
    }

    cmdStr += ' GROUP BY MONTH ';
    cmdStr += ` ORDER BY FIELD(MONTH, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')`;
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

  public async retrieveItemPairAnalysis(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
        SELECT 
            p.Item_A, desc_a.DESCRIPTION AS Description_A, 
            p.Item_B, desc_b.DESCRIPTION AS Description_B, 
            p.frequency AS pair_count,
            a.support_count AS support_A,
            (p.frequency / a.support_count) AS confidence_A_to_B,
            (p.frequency * t.total_transactions / (a.support_count * b.support_count)) AS lift
        FROM (
            SELECT 
                a.ITEMNUMBER AS Item_A, 
                b.ITEMNUMBER AS Item_B, 
                COUNT(*) AS frequency
            FROM 
                VITARICH_SALES_2024 a
            JOIN 
                VITARICH_SALES_2024 b
            ON 
                a.ORDERNUMBER = b.ORDERNUMBER
                AND a.ITEMNUMBER < b.ITEMNUMBER
            GROUP BY 
                a.ITEMNUMBER, b.ITEMNUMBER
        ) p
        JOIN (
            SELECT 
                ITEMNUMBER, 
                DESCRIPTION,
                COUNT(DISTINCT ORDERNUMBER) AS support_count
            FROM 
                VITARICH_SALES_2024
            GROUP BY 
                ITEMNUMBER
        ) a ON p.Item_A = a.ITEMNUMBER
        JOIN (
            SELECT 
                ITEMNUMBER, 
                COUNT(DISTINCT ORDERNUMBER) AS support_count
            FROM 
                VITARICH_SALES_2024
            GROUP BY 
                ITEMNUMBER
        ) b ON p.Item_B = b.ITEMNUMBER
        JOIN VITARICH_SALES_2024 desc_a ON p.Item_A = desc_a.ITEMNUMBER
        JOIN VITARICH_SALES_2024 desc_b ON p.Item_B = desc_b.ITEMNUMBER
        CROSS JOIN (
            SELECT COUNT(DISTINCT ORDERNUMBER) AS total_transactions FROM VITARICH_SALES_2024
        ) t
    `;

    if (r.filter) {
        cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['Item_A', 'Item_B'], ['Item_A', 'Item_B']);
    }
    
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveItemPairAnalysisSort(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
        SELECT 
            p.Item_A, desc_a.DESCRIPTION AS Description_A, 
            p.Item_B, desc_b.DESCRIPTION AS Description_B, 
            p.frequency AS pair_count,
            a.support_count AS support_A,
            (p.frequency / a.support_count) AS confidence_A_to_B,
            (p.frequency * t.total_transactions / (a.support_count * b.support_count)) AS lift
        FROM (
            SELECT 
                a.ITEMNUMBER AS Item_A, 
                b.ITEMNUMBER AS Item_B, 
                COUNT(*) AS frequency
            FROM 
                VITARICH_SALES_2024 a
            JOIN 
                VITARICH_SALES_2024 b
            ON 
                a.ORDERNUMBER = b.ORDERNUMBER
                AND a.ITEMNUMBER < b.ITEMNUMBER
            GROUP BY 
                a.ITEMNUMBER, b.ITEMNUMBER
        ) p
        JOIN (
            SELECT 
                ITEMNUMBER, 
                DESCRIPTION,
                COUNT(DISTINCT ORDERNUMBER) AS support_count
            FROM 
                VITARICH_SALES_2024
            GROUP BY 
                ITEMNUMBER
        ) a ON p.Item_A = a.ITEMNUMBER
        JOIN (
            SELECT 
                ITEMNUMBER, 
                COUNT(DISTINCT ORDERNUMBER) AS support_count
            FROM 
                VITARICH_SALES_2024
            GROUP BY 
                ITEMNUMBER
        ) b ON p.Item_B = b.ITEMNUMBER
        JOIN VITARICH_SALES_2024 desc_a ON p.Item_A = desc_a.ITEMNUMBER
        JOIN VITARICH_SALES_2024 desc_b ON p.Item_B = desc_b.ITEMNUMBER
        CROSS JOIN (
            SELECT COUNT(DISTINCT ORDERNUMBER) AS total_transactions FROM VITARICH_SALES_2024
        ) t
    `;

    if (r.filter) {
        cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['Item_A', 'Item_B'], ['Item_A', 'Item_B']);
    }
    
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveSalesPerWeek2024(r: TransactionsRequest): Promise<TransactionResponse> {
    let cmdStr = `
      SELECT 
          YEAR(GLDATE) AS YEAR,
          WEEK(GLDATE, 1) AS WEEK,
          SUM(REVENUEAMOUNT) AS weekly_sales
      FROM 
          VITARICH_SALES_2024
    `;

    
    const filterValue = ['MONTH', 'LINEQTY', 'AT50KG'];
    if (r.filter) {
      cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['MONTH', 'LINEQTY', 'AT50KG'], filterValue);
    }
    
    cmdStr += ' GROUP BY YEAR, WEEK ';
    cmdStr += ` ORDER BY YEAR, WEEK `;
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    
    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveItemPairAnalysisFINAL(r: TransactionsRequest, dataset: string): Promise<TransactionResponse> {
    let cmdStr = `
        WITH PairFrequency AS (
            SELECT
                a.DESCRIPTION AS Item_A,
                b.DESCRIPTION AS Item_B,
                COUNT(*) AS frequency
            FROM
                ${dataset} a
            JOIN
                ${dataset} b
            ON
                a.ORDERNUMBER = b.ORDERNUMBER
                AND a.DESCRIPTION < b.DESCRIPTION
            GROUP BY
                a.DESCRIPTION, b.DESCRIPTION
        ),
        ItemSupport AS (
            SELECT
                DESCRIPTION AS Item,
                COUNT(DISTINCT ORDERNUMBER) AS support_count
            FROM
                ${dataset}
            GROUP BY
                DESCRIPTION
        ),
        TotalTransactions AS (
            SELECT COUNT(DISTINCT ORDERNUMBER) AS total_transactions
            FROM ${dataset}
        )
        SELECT 
            pf.Item_A AS Description_A,
            pf.Item_B AS Description_B,
            pf.frequency AS pair_count,
            pf.frequency / tt.total_transactions AS support_A_to_B,
            (pf.frequency / ia.support_count) AS confidence_A_to_B,
            (pf.frequency * tt.total_transactions / (ia.support_count * ib.support_count)) AS lift
        FROM
            PairFrequency pf
        JOIN ItemSupport ia ON pf.Item_A = ia.Item
        JOIN ItemSupport ib ON pf.Item_B = ib.Item
        CROSS JOIN TotalTransactions tt 
        WHERE 
            (pf.frequency * tt.total_transactions / (ia.support_count * ib.support_count)) <= 7 
    `;

    if (r.filter) {
        cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['Item_A', 'Item_B'], ['Item_A', 'Item_B']);
    }

    cmdStr = BaseHelper.determineSort(r, cmdStr, 'pf.Item_A', 'ItemPairAnalysisFINAL');// reused old sorting
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveCombinedItemPairAnalysis(r: TransactionsRequest): Promise<TransactionResponse> {
    const dataset2023 = 'VT_DATASET_2023';
    const dataset2024 = 'VT_DATASET_2024';

    let cmdStr = `
        WITH CombinedDataset AS (
            SELECT 
                DESCRIPTION,
                ORDERNUMBER,
                '2023' AS year
            FROM ${dataset2023}
            UNION ALL
            SELECT 
                DESCRIPTION,
                ORDERNUMBER,
                '2024' AS year
            FROM ${dataset2024}
        ),
        PairFrequency AS (
            SELECT
                a.DESCRIPTION AS Item_A,
                b.DESCRIPTION AS Item_B,
                COUNT(*) AS frequency,
                a.year AS year
            FROM
                CombinedDataset a
            JOIN
                CombinedDataset b
            ON
                a.ORDERNUMBER = b.ORDERNUMBER
                AND a.DESCRIPTION < b.DESCRIPTION
                AND a.year = b.year
            GROUP BY
                a.DESCRIPTION, b.DESCRIPTION, a.year
        ),
        ItemSupport AS (
            SELECT
                DESCRIPTION AS Item,
                COUNT(DISTINCT ORDERNUMBER) AS support_count,
                year
            FROM
                CombinedDataset
            GROUP BY
                DESCRIPTION, year
        ),
        TotalTransactions AS (
            SELECT COUNT(DISTINCT ORDERNUMBER) AS total_transactions, year
            FROM CombinedDataset
            GROUP BY year
        )
        SELECT 
            pf.Item_A AS Description_A,
            pf.Item_B AS Description_B,
            pf.frequency AS pair_count,
            pf.frequency / tt.total_transactions AS support_A_to_B,
            (pf.frequency / ia.support_count) AS confidence_A_to_B,
            (pf.frequency * tt.total_transactions / (ia.support_count * ib.support_count)) AS lift,
            pf.year
        FROM
            PairFrequency pf
        JOIN ItemSupport ia ON pf.Item_A = ia.Item AND pf.year = ia.year
        JOIN ItemSupport ib ON pf.Item_B = ib.Item AND pf.year = ib.year
        JOIN TotalTransactions tt ON pf.year = tt.year
        WHERE 
            (pf.frequency * tt.total_transactions / (ia.support_count * ib.support_count)) <= 7
    `;

    if (r.filter) {
        cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['Item_A', 'Item_B'], ['Item_A', 'Item_B']);
    }

    cmdStr = BaseHelper.determineSort(r, cmdStr, 'pf.year', 'CombinedItemPairAnalysis');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrievePairCountItemPairAnalysis(r: TransactionsRequest): Promise<TransactionResponse> {
    const dataset2023 = 'VT_DATASET_2023';
    const dataset2024 = 'VT_DATASET_2024';

    let cmdStr = `
        WITH CombinedDataset AS (
            SELECT 
                DESCRIPTION,
                ORDERNUMBER,
                '2023' AS year
            FROM ${dataset2023}
            UNION ALL
            SELECT 
                DESCRIPTION,
                ORDERNUMBER,
                '2024' AS year
            FROM ${dataset2024}
        ),
        PairFrequency AS (
            SELECT
                a.DESCRIPTION AS Item_A,
                b.DESCRIPTION AS Item_B,
                COUNT(*) AS frequency,
                a.year AS year
            FROM
                CombinedDataset a
            JOIN
                CombinedDataset b
            ON
                a.ORDERNUMBER = b.ORDERNUMBER
                AND a.DESCRIPTION < b.DESCRIPTION
                AND a.year = b.year
            GROUP BY
                a.DESCRIPTION, b.DESCRIPTION, a.year
        ),
        ItemSupport AS (
            SELECT
                DESCRIPTION AS Item,
                COUNT(DISTINCT ORDERNUMBER) AS support_count,
                year
            FROM
                CombinedDataset
            GROUP BY
                DESCRIPTION, year
        ),
        TotalTransactions AS (
            SELECT COUNT(DISTINCT ORDERNUMBER) AS total_transactions, year
            FROM CombinedDataset
            GROUP BY year
        )
        SELECT 
            pf.Item_A AS Description_A,
            pf.Item_B AS Description_B,
            pf.frequency AS pair_count
        FROM
            PairFrequency pf
        JOIN ItemSupport ia ON pf.Item_A = ia.Item AND pf.year = ia.year
        JOIN ItemSupport ib ON pf.Item_B = ib.Item AND pf.year = ib.year
        JOIN TotalTransactions tt ON pf.year = tt.year
        WHERE 
            (pf.frequency * tt.total_transactions / (ia.support_count * ib.support_count)) <= 7
    `;

    if (r.filter) {
        cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['Item_A', 'Item_B'], ['Item_A', 'Item_B']);
    }

    cmdStr = BaseHelper.determineSort(r, cmdStr, 'pf.Item_A', 'ItemPairAnalysisFINAL');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    return await BaseHelper.retrieveResponse(cmdStr);
  }

  public async retrieveProductCountAnalysis(r: TransactionsRequest): Promise<TransactionResponse> {
    const dataset2023 = 'VT_DATASET_2023';
    const dataset2024 = 'VT_DATASET_2024';

    let cmdStr = `
        WITH CombinedDataset AS (
            SELECT 
                DESCRIPTION
            FROM ${dataset2023}
            UNION ALL
            SELECT 
                DESCRIPTION
            FROM ${dataset2024}
        )
        SELECT 
            DESCRIPTION AS product,
            COUNT(*) AS count
        FROM 
            CombinedDataset
        GROUP BY 
            DESCRIPTION
    `;

    if (r.filter) {
        cmdStr = BaseHelper.applyFilters(r.filter, cmdStr, ['DESCRIPTION'], ['DESCRIPTION']);
    }

    // cmdStr = BaseHelper.determineSort(r, cmdStr, 'DESCRIPTION', 'ProductCountAnalysis');
    cmdStr += BaseHelper.applyPagination(r.page, r.limit);

    return await BaseHelper.retrieveResponse(cmdStr);
  }

  // #endregion
}
