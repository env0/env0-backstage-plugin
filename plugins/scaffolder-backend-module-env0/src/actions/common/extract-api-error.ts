export const extractApiError = (error: any) => {
  let errorMessage = error.response?.data || error.message;
  if (errorMessage instanceof Object) {
    errorMessage = JSON.stringify(errorMessage);
  }
  return new Error(errorMessage);
};
