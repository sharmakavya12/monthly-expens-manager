import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import {
  BarChart, Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer
} from 'recharts'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { FaArrowLeft, FaMoon, FaSun, FaCalendarAlt, FaDownload } from 'react-icons/fa'

ChartJS.register(ArcElement, ChartTooltip, Legend)

const Reports = () => {
  const { incomes, expenses, theme, toggleTheme } = useFinance()
  const [dateRange, setDateRange] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const now = new Date()
    let startDate

    switch (dateRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // All time
    }

    const filteredIncomes = incomes.filter(income => new Date(income.date) >= startDate)
    const filteredExpenses = expenses.filter(expense => new Date(expense.date) >= startDate)

    if (selectedCategory !== 'all') {
      return {
        incomes: filteredIncomes.filter(income => income.category === selectedCategory),
        expenses: filteredExpenses.filter(expense => expense.category === selectedCategory)
      }
    }

    return { incomes: filteredIncomes, expenses: filteredExpenses }
  }, [incomes, expenses, dateRange, selectedCategory])

  // Calculate totals
  const totalIncome = filteredData.incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = filteredData.expenses.reduce((sum, item) => sum + item.amount, 0)
  const netIncome = totalIncome - totalExpense

  // Prepare chart data
  const monthlyData = useMemo(() => {
    const data = {}
    const allTransactions = [
      ...filteredData.incomes.map(item => ({ ...item, type: 'income' })),
      ...filteredData.expenses.map(item => ({ ...item, type: 'expense' }))
    ]

    allTransactions.forEach(item => {
      const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!data[month]) {
        data[month] = { month, income: 0, expense: 0 }
      }
      data[month][item.type] += item.amount
    })

    return Object.values(data).sort((a, b) => new Date(a.month) - new Date(b.month))
  }, [filteredData])

  const categoryExpenseData = useMemo(() => {
    const data = {}
    filteredData.expenses.forEach(expense => {
      data[expense.category] = (data[expense.category] || 0) + expense.amount
    })
    return Object.entries(data).map(([category, amount]) => ({ category, amount }))
  }, [filteredData.expenses])

  const categoryIncomeData = useMemo(() => {
    const data = {}
    filteredData.incomes.forEach(income => {
      data[income.category] = (data[income.category] || 0) + income.amount
    })
    return Object.entries(data).map(([category, amount]) => ({ category, amount }))
  }, [filteredData.incomes])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const exportData = () => {
    const csvContent = [
      ['Date', 'Type', 'Category', 'Title', 'Amount'],
      ...filteredData.incomes.map(item => [item.date, 'Income', item.category, item.title, item.amount]),
      ...filteredData.expenses.map(item => [item.date, 'Expense', item.category, item.title, item.amount])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Use browser's print functionality to capture entire page including charts
    window.print()
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="mr-4 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <FaArrowLeft className="text-lg" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Analyze your financial data and trends</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun className="text-yellow-500" />}
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
              >
                <FaDownload className="mr-2" />
                Download PDF
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200"
              >
                <FaDownload className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set([...incomes.map(i => i.category), ...expenses.map(e => e.category)])).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Total Income</h3>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Total Expenses</h3>
                <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Net Income</h3>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netIncome.toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transactions</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredData.incomes.length + filteredData.expenses.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Expense Categories</h3>
            {categoryExpenseData.length > 0 ? (
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'perspective(1000px) rotateX(15deg)' }}>
                <Pie
                  data={{
                    labels: categoryExpenseData.map(item => item.category),
                    datasets: [{
                      data: categoryExpenseData.map(item => item.amount),
                      backgroundColor: COLORS,
                      borderColor: '#fff',
                      borderWidth: 2,
                      hoverOffset: 10
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: theme === 'dark' ? '#fff' : '#000'
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `$${context.parsed.toFixed(2)}`
                        }
                      }
                    },
                    rotation: -15,
                    circumference: 360,
                    cutout: '0%'
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Income vs Expense Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Income vs Expense Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'Financial Overview', income: totalIncome, expense: totalExpense }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expense" fill="#EF4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports
