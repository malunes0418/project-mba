export class TransactionResponse {
    isSuccess: boolean;
    message: string;
    page: string;
    row: string;
    total: number;
    data: Array<{ [key: string]: any }>;
  
    constructor(
      isSuccess: boolean,
      message: string,
      page: string,
      row: string,
      total: number,
      data: Array<{ [key: string]: any }>
    ) {
      this.isSuccess = isSuccess;
      this.message = message;
      this.page = page;
      this.row = row;
      this.total = total;
      this.data = data;
    }
  }
  
  export const createTransactionResponse = (
    isSuccess: boolean,
    message: string,
    page: string,
    row: string,
    total: number,
    data: Array<{ [key: string]: any }>
  ): TransactionResponse => {
    return new TransactionResponse(isSuccess, message, page, row, total, data);
  };
  