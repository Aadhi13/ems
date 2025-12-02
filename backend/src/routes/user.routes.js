import { Router } from "express";
import { getExpenses, addExpense, deleteExpense } from "../controllers/expense.controller.js";

const router = Router();

router.get("/expenses", getExpenses);
router.post("/expenses", addExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;
