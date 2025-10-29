
import React, { createContext, useContext, useState, useEffect } from 'react';
import {registerUser,loginUser,getUserInfo,uploadImage,getDashboardData,addIncome,getAllIncome,deleteIncome,addExpense,getAllExpense,deleteExpense,addBudget,getAllBudgets,deleteBudget,} from '../utils/api';
import { toast } from 'react-hot-toast';

const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [dashboardData, setDashboardData] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(false);

  // ---------- THEME ----------
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // ---------- AUTH ----------
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerUser(userData);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIncomes([]);
    setExpenses([]);
    setBudgets({});
    setDashboardData(null);
    toast.success('Logged out successfully');
  };

  // ---------- FETCH DATA ----------
  const fetchUserInfo = async () => {
    if (!token) return;
    try {
      const { data } = await getUserInfo();
      setUser(data);
    } catch (error) {
      logout();
    }
  };

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const { data } = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchIncomes = async () => {
    if (!token) return;
    try {
      const { data } = await getAllIncome();
      setIncomes(data);
    } catch (error) {
      toast.error('Failed to load incomes');
    }
  };

  const fetchExpenses = async () => {
    if (!token) return;
    try {
      const { data } = await getAllExpense();
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to load expenses');
    }
  };

  const fetchBudgets = async () => {
    if (!token) return;
    try {
      const { data } = await getAllBudgets();
      const budgetMap = {};
      if (Array.isArray(data)) data.forEach(b => (budgetMap[b.category] = b.amount));
      setBudgets(budgetMap);
    } catch (error) {
      toast.error('Failed to load budgets');
    }
  };

  // ---------- CRUD ----------
  const addIncomeItem = async (incomeData) => { await addIncome(incomeData); await fetchIncomes(); await fetchDashboardData(); };
  const removeIncome = async (id) => { await deleteIncome(id); await fetchIncomes(); await fetchDashboardData(); };
  const addExpenseItem = async (expenseData) => { await addExpense(expenseData); await fetchExpenses(); await fetchDashboardData(); };
  const removeExpense = async (id) => { await deleteExpense(id); await fetchExpenses(); await fetchDashboardData(); };
  const addBudgetItem = async (budgetData) => { await addBudget(budgetData); await fetchBudgets(); };
  const removeBudget = async (category) => {
    const { data: allBudgets } = await getAllBudgets();
    const budget = allBudgets.find(b => b.category === category);
    if (!budget) throw new Error('Budget not found');
    await deleteBudget(budget._id);
    await fetchBudgets();
  };

  // ---------- UTILITY ----------
  const getTotalIncomes = () => incomes.reduce((t, i) => t + parseFloat(i.amount), 0);
  const getTotalExpenses = () => expenses.reduce((t, e) => t + parseFloat(e.amount), 0);
  const getBudgetProgress = (category) => {
    const spent = expenses.filter(e => e.category === category).reduce((t, e) => t + parseFloat(e.amount), 0);
    return budgets[category] ? (spent / budgets[category]) * 100 : 0;
  };

  // ---------- EFFECTS ----------
  useEffect(() => { if (token) { fetchUserInfo(); fetchDashboardData(); fetchIncomes(); fetchExpenses(); fetchBudgets(); } }, [token]);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);

  // ---------- CONTEXT ----------
  return (
    <FinanceContext.Provider value={{
      user, token, incomes, expenses, budgets, dashboardData, theme, loading,
      register, login, logout, uploadProfileImage: async (file) => { const form = new FormData(); form.append('image', file); await uploadImage(form); },
      toggleTheme, fetchDashboardData, fetchIncomes, fetchExpenses, fetchBudgets,
      addIncome: addIncomeItem, deleteIncome: removeIncome,
      addExpense: addExpenseItem, deleteExpense: removeExpense,
      addBudget: addBudgetItem, deleteBudget: removeBudget,
      getTotalIncomes, getTotalExpenses, getBudgetProgress
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
