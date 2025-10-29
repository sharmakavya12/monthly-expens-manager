const xlsx = require("xlsx");
const Expense = require("../models/Expense.js");
exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, category, amount, date } = req.body || {};

    if (!category || !amount) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
    });
    await newExpense.save();
    return res.status(200).json(newExpense);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.deleteExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found or not authorized" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data= expense.map((item) =>({
      Category:item.category,
      Amount:item.amount,
      Date:item.date
    }));
    const wb = xlsx.utils.book_new();
     const ws = xlsx.utils.json_to_sheet(data);
     xlsx.utils.book_append_sheet(wb,ws,"Expense");
     const fileName = `expense_details_${Date.now()}.xlsx`;
     xlsx.writeFile(wb, fileName);
     res.download(fileName, (err) => {
       if (err) {
         console.error('Error downloading file:', err);
       }
       // Delete the file after download
       const fs = require('fs');
       fs.unlink(fileName, (unlinkErr) => {
         if (unlinkErr) console.error('Error deleting file:', unlinkErr);
       });
     });
  } catch(error) {
     res.status(500).json({ message: "Server Error" });
  }
};
