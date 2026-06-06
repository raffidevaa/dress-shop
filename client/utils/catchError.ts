interface Error {
  message: string;
}
interface Message {
  message?: string;
  error?: Error;
}

interface Response {
  data?: Message;
}

interface ErrorData {
  response?: Response;
  message: string;
}

export const catchError = (error: any): string => {
  if (error.response) {
    const errorMsg = error.response?.data?.message || error.response?.data?.error?.message;
    if (errorMsg) return errorMsg;
    return `Server Error: ${error.response.status}`;
  }

  if (error.request) {
    return 'No response from server. Check your network or API URL.';
  }

  return error.message || 'An unknown error occurred';
};
