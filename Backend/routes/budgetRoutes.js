const express = require("express");
const {
  addBudget,
  getAllBudgets,
  deleteBudget,
} = require("../controllers/budgetControllers.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/add", protect, addBudget);
router.get("/get", protect, getAllBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
