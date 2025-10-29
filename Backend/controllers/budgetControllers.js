const Budget = require("../models/Budget.js");

// Add Budget
exports.addBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const userId = req.user.id;

    if (!category || !amount) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const budget = await Budget.create({
      userId,
      category,
      amount: parseFloat(amount),
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({
      message: "Error in adding budget",
      error: err.message,
    });
  }
};

// Get All Budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({
      message: "Error in getting budgets",
      error: err.message,
    });
  }
};

// Delete Budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error in deleting budget",
      error: err.message,
    });
  }
};
