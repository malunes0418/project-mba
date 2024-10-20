import { QueryTypes } from 'sequelize';
import sequelize from '../config/db'; // Assuming this is your Sequelize instance
import { TransactionResponse } from '../models/Transaction/transactionResponse';
import { TransactionsRequest } from '../models/Transaction/transactionRequest';

export class BaseHelper {
    /**
     * Helper method to determine the sort order of an SQL query.
     * @param r - The request object containing sorting information
     * @param cmdStr - The base SQL command string
     * @param defaultSort - The default column to sort by
     * @param tableName - The table name for the query
     * @returns {string} - The modified SQL command string with sorting applied
     */
    static determineSort(
        r: TransactionsRequest,
        cmdStr: string,
        defaultColumn: string,
        reportType: string
      ): string {
        if (reportType === 'VITARICH_SALES') {
          switch (r.sortColumn) {
            case 'REGION':
              r.sortColumn = 'REGION';
              break;
            case 'CUSTOMER':
              r.sortColumn = 'CUSTOMER';
              break;
            case 'SALESPERSON':
              r.sortColumn = 'SALESPERSON';
              break;
            case 'TERMNAME':
              r.sortColumn = 'TERMNAME';
              break;
            case 'TERMDAYS':
              r.sortColumn = 'TERMDAYS';
              break;
            case 'INVOICENUMBER':
              r.sortColumn = 'INVOICENUMBER';
              break;
            case 'ITEMNUMBER':
              r.sortColumn = 'ITEMNUMBER';
              break;
            case 'DESCRIPTION':
              r.sortColumn = 'DESCRIPTION';
              break;
            case 'LINEQTY':
              r.sortColumn = 'LINEQTY';
              break;
            case 'UOM':
              r.sortColumn = 'UOM';
              break;
            case 'AT50KG':
              r.sortColumn = 'AT50KG';
              break;
            case 'UNITSELLINGPRICE':
              r.sortColumn = 'UNITSELLINGPRICE';
              break;
            case 'LINEAMOUNT':
              r.sortColumn = 'LINEAMOUNT';
              break;
            case 'DISCOUNT':
              r.sortColumn = 'DISCOUNT';
              break;
            case 'TAXAMOUNT':
              r.sortColumn = 'TAXAMOUNT';
              break;
            case 'FREIGHTAMOUNT':
              r.sortColumn = 'FREIGHTAMOUNT';
              break;
            case 'EXTENDEDAMOUNT':
              r.sortColumn = 'EXTENDEDAMOUNT';
              break;
            case 'CATEGORYSETDESC':
              r.sortColumn = 'CATEGORYSETDESC';
              break;
            case 'GROUPING':
              r.sortColumn = 'GROUPING';
              break;
            case 'ITEMSUBGROUP':
              r.sortColumn = 'ITEMSUBGROUP';
              break;
            case 'GLMONTH':
              r.sortColumn = 'GLMONTH';
              break;
            default:
              r.sortColumn = defaultColumn; // Default to CUSTOMER if no valid sortColumn
              break;
          }
        }
        if (reportType === 'GROUPED_TRANSACTIONS') {
          switch (r.sortColumn) {
            case 'INVOICENUMBER':
              r.sortColumn = 'INVOICENUMBER';
              break;
            case 'ITEMS':
              r.sortColumn = 'ITEMS';
              break;
            default:
              r.sortColumn = defaultColumn;
              break;
          }
        }
    
        // Append the sort column and sort type to the SQL query
        cmdStr += ` ORDER BY ${r.sortColumn}`;
        cmdStr += r.sortType === 'ASC' ? ' ASC' : ' DESC';
    
        return cmdStr;
      }
  
    /**
     * Helper method to handle pagination in SQL queries.
     * @param page - The current page number
     * @param limit - The number of rows per page
     * @returns {string} - The LIMIT clause for SQL
     */
    static applyPagination(page?: string, limit?: string): string {
      let pageNumber = 0;
      let limitNumber = 10; // Default limit
  
      if (page && limit) {
        pageNumber = parseInt(page) - 1;
        limitNumber = parseInt(limit);
        pageNumber = pageNumber * limitNumber;
      }
  
      return ` LIMIT ${pageNumber}, ${limitNumber}`;
    }
  
    /**
     * Helper method to apply filters based on the request query.
     * @param filter - A string containing filter parameters
     * @param cmdStr - The base SQL command string
     * @param validFilters - An array of valid filter columns
     * @returns {string} - The modified SQL command string with filters applied
     */
    static applyFilters(filter: string, cmdStr: string, validFilters: string[]): string {
      if (filter) {
        const filters = filter.split(':');
        filters.forEach((f) => {
          const [key, value] = f.split('|');
          if (validFilters.includes(key)) {
            cmdStr += ` AND ${key} = "${value}"`;
          }
        });
      }
      return cmdStr;
    }
    /**
   * Retrieves data from the database and returns it in a TransactionResponse structure.
   * @param query - The SQL query to execute
   * @param connStr - Optional connection string (not needed when using Sequelize)
   * @returns {Promise<TransactionResponse>} - The response containing the data or an error message
   */
    static async retrieveResponse(query: string): Promise<any> {
      const resp = new TransactionResponse();
  
      try {
        // Execute the query and retrieve data
        const contents = await sequelize.query(query, { type: QueryTypes.SELECT });
  
        resp.isSuccess = true;
        resp.message = 'Information has been retrieved.';
        resp.data = contents;
  
        let total = 0;
  
        // Check for "ORDER BY" and "LIMIT *" and calculate the total count
        const text = 'LIMIT *';
        const pattern = new RegExp(text.replace(/\*/g, '.*').replace(/\?/g, '.'), 'i');
        const match = pattern.exec(query);
  
        if (query.includes('ORDER BY') && match) {
          const limitIndexInStr = match.index;
          const limitStr = query.substring(0, limitIndexInStr);
          const countQuery = `SELECT COUNT(*) AS CNT FROM (${limitStr}) AS SubQuery`;
  
          const countResult: any = await sequelize.query(countQuery, { type: QueryTypes.SELECT });
          total = countResult[0]?.CNT || 0;
          resp.total = total;
        }
      } catch (error: any) {
        resp.isSuccess = false;
        resp.message = error.message;
        console.error(resp.message);
      }
      return {
        isSuccess: resp.isSuccess,
        message: resp.message,
        total: resp.total,
        data: resp.data,
      };
    }
  }
  