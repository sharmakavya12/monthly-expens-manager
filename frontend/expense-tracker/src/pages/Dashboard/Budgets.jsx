import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import { FaPlus, FaTrash, FaArrowLeft, FaMoon, FaSun, FaChartPie } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

const Budgets = () => {
  const { budgets, expenses, addBudget, deleteBudget, getBudgetProgress, theme, toggleTheme } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [budgetForm, setBudgetForm] = useState({
    category: 'Food',
    amount: ''
  })

  const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other']

  const handleChange = (e) => {
    setBudgetForm({
      ...budgetForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!budgetForm.amount || parseFloat(budgetForm.amount) <= 0) {
      toast.error('Please enter a valid budget amount')
      return
    }

    addBudget({
      category: budgetForm.category,
      amount: parseFloat(budgetForm.amount)
    })

    toast.success('Budget added successfully!')
    setBudgetForm({
      category: 'Food',
      amount: ''
    })
    setShowForm(false)
  }

  const handleDelete = (category) => {
    deleteBudget(category)
    toast.success('Budget deleted successfully!')
  }

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-red-500'
    if (progress >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getProgressStatus = (progress) => {
    if (progress >= 100) return 'Over Budget'
    if (progress >= 80) return 'Near Limit'
    return 'On Track'
  }

  const totalBudget = Object.values(budgets).reduce((sum, amount) => sum + amount, 0)
  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Set and monitor your spending limits</p>
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
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                <FaPlus className="mr-2" />
                Add Budget
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Total Budget</h3>
                <p className="text-3xl font-bold text-blue-600">${totalBudget.toFixed(2)}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{Object.keys(budgets).length} categories</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <FaChartPie className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Total Spent</h3>
                <p className="text-3xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{expenses.length} transactions</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <FaChartPie className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Remaining</h3>
                <p className={`text-3xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(totalBudget - totalSpent).toFixed(2)}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% used` : 'No budget set'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <FaChartPie className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Budget</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={budgetForm.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Budget Amount ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={budgetForm.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-semibold"
                >
                  Add Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budget List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Budgets</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor your spending against set budgets</p>
          </div>

          {Object.keys(budgets).length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(budgets).map(([category, budgetAmount]) => {
                const spent = expenses
                  .filter(expense => expense.category === category)
                  .reduce((total, expense) => total + parseFloat(expense.amount), 0)
                const progress = getBudgetProgress(category)

                return (
                  <div key={category} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-4">
                          <FaChartPie className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{category}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ${spent.toFixed(2)} spent of ${budgetAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          progress >= 100 ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                          progress >= 80 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                          'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        }`}>
                          {getProgressStatus(progress)}
                        </span>
                        <button
                          onClick={() => handleDelete(category)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <FaChartPie className="text-gray-300 dark:text-gray-600 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Budgets Set</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">Create budgets to better control your spending</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-semibold"
              >
                Set Your First Budget
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Budgets
