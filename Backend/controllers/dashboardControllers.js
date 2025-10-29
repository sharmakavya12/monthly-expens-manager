const Income = require("../models/Income.js");
const Expense = require("../models/Expense.js");
const { isValidObjectId } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Total Income & Expense
    const totalIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Last 60 days income
    const last60daysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });
    const incomeLast60days = last60daysIncomeTransactions.reduce(
      (sum, txn) => sum + (txn.amount || 0),
      0
    );

    // Last 30 days expenses
    const last30daysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });
    const expenseLast30days = last30daysExpenseTransactions.reduce(
      (sum, txn) => sum + (txn.amount || 0),
      0
    );

    // Last 5 incomes & expenses combined
    const lastIncome = await Income.find({ userId }).sort({ date: -1 }).limit(5);
    const lastExpense = await Expense.find({ userId }).sort({ date: -1 }).limit(5);

    const lastTransactions = [
      ...lastIncome.map(txn => ({
        ...txn.toObject(),
        type: "income",
        title: txn.source || "Income",
      })),
      ...lastExpense.map(txn => ({
        ...txn.toObject(),
        type: "expense",
        title: txn.category || "Expense",
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30daysExpenses: {
        total: expenseLast30days,
        transactions: last30daysExpenseTransactions,
      },
      last60daysIncome: {
        total: incomeLast60days,
        transactions: last60daysIncomeTransactions,
      },
      recentTransaction: lastTransactions,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
