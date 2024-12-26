export const extractApiError = (error: any) => {
  return new Error(error.response?.data || error.message);
};
