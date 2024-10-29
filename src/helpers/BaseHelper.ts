import { QueryTypes } from 'sequelize';
import sequelize from '../config/db'; 
import { TransactionResponse } from '../models/Transaction/transactionResponse';
import { TransactionsRequest } from '../models/Transaction/transactionRequest';

export class BaseHelper {
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
              r.sortColumn = defaultColumn; 
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
        if (reportType === 'CO_OCCURRENCE') {
          switch (r.sortColumn) {
            case 'item1':
              r.sortColumn = 'item1';
              break;
            case 'item2':
              r.sortColumn = 'item2';
              break;
            case 'frequency':
              r.sortColumn = 'frequency';
              break;
            default:
              r.sortColumn = defaultColumn;
              break;
          }
        }

        if (reportType === 'SUPPORT') {
          switch (r.sortColumn) {
            case 'T_ITEMDESCRIPTION':
              r.sortColumn = 'T_ITEMDESCRIPTION';
              break;
            case 'support':
              r.sortColumn = 'support';
              break;
            default:
              r.sortColumn = defaultColumn;
              break;
          }
        }

        if (reportType === 'CONFIDENCE') {
          switch (r.sortColumn) {
            case 'item1':
              r.sortColumn = 'item1';
              break;
            case 'item2':
              r.sortColumn = 'item2';
              break;
            case 'confidence':
              r.sortColumn = 'confidence';
              break;
            default:
              r.sortColumn = defaultColumn;
              break;
          }
        }

        if (reportType === 'LIFT') {
          switch (r.sortColumn) {
            case 'item1':
              r.sortColumn = 'item1';
              break;
            case 'item2':
              r.sortColumn = 'item2';
              break;
            case 'lift':
              r.sortColumn = 'lift';
              break;
            default:
              r.sortColumn = defaultColumn;
              break;
          }
        }

        if (reportType === 'TOTALSALES') {
          switch (r.sortColumn) {
            case 'TotalSales':
              r.sortColumn = 'TotalSales';
              break;
            default:
              r.sortColumn = defaultColumn;
              break;
          }
        }
    
        
        cmdStr += ` ORDER BY ${r.sortColumn}`;
        cmdStr += r.sortType === 'ASC' ? ' ASC' : ' DESC';
    
        return cmdStr;
      }

    static applyPagination(page?: string, limit?: string): string {
      let pageNumber = 0;
      let limitNumber = 10; 
  
      if (page && limit) {
        pageNumber = parseInt(page) - 1;
        limitNumber = parseInt(limit);
        pageNumber = pageNumber * limitNumber;
      }
  
      return ` LIMIT ${pageNumber}, ${limitNumber}`;
    }

    static applyFilters(filter: string, cmdStr: string, validFilters: string[], filterValue: string[]): string {
      if (filter) {
        const filters = filter.split(':');

        filters.forEach((f) => {
            const [key, value] = f.split('|');
            const index = validFilters.indexOf(key);

            
            if (index !== -1) {
                const columnName = filterValue[index];
                cmdStr += ` AND ${columnName} = "${value}"`;
            }
        });
      }
      return cmdStr;
    }

    static async retrieveResponse(query: string): Promise<any> {
      const resp = new TransactionResponse();
  
      try {
        
        const contents = await sequelize.query(query, { type: QueryTypes.SELECT });
  
        resp.isSuccess = true;
        resp.message = 'Information has been retrieved.';
        resp.data = contents;
  
        let total = 0;
  
        
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
  