export class ApiResponse {
    isSuccess: boolean;
    message: string;
    data?: any;
  
    constructor(isSuccess: boolean, message: string, data?: any) {
      this.isSuccess = isSuccess;
      this.message = message;
      this.data = data || null;
    }
  }
  
  export const successResponse = (message: string, data: any = null) => {
    return new ApiResponse(true, message, data);
  };
  
  export const errorResponse = (message: string, data: any = null) => {
    return new ApiResponse(false, message, data);
  };
  