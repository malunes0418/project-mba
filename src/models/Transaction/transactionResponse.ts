export class TransactionResponse {
    isSuccess: boolean;
    message: string;
    page?: string;
    row?: string;
    total?: number;
    data: Array<{ [key: string]: any }> = [];
  
    constructor() {
      this.isSuccess = false;
      this.message = '';
      this.data = [];
    }
  }
  