const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_PATHS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_USER: `${API_BASE_URL}/auth/getUser`,
  UPLOAD_IMAGE: `${API_BASE_URL}/auth/upload-image`,

  // Dashboard
  DASHBOARD: `${API_BASE_URL}/dashboard`,

  // Income
  ADD_INCOME: `${API_BASE_URL}/income/add`,
  GET_INCOME: `${API_BASE_URL}/income/get`,
  DELETE_INCOME: `${API_BASE_URL}/income`,
  DOWNLOAD_INCOME_EXCEL: `${API_BASE_URL}/income/downloadincomeexcel`,

  // Expense
  ADD_EXPENSE: `${API_BASE_URL}/expense/add`,
  GET_EXPENSE: `${API_BASE_URL}/expense/get`,
  DELETE_EXPENSE: `${API_BASE_URL}/expense`,
  DOWNLOAD_EXPENSE_EXCEL: `${API_BASE_URL}/expense/downloadexpenseexcel`,

  // Budget
  ADD_BUDGET: `${API_BASE_URL}/budget/add`,
  GET_BUDGETS: `${API_BASE_URL}/budget/get`,
  DELETE_BUDGET: `${API_BASE_URL}/budget`,
};
