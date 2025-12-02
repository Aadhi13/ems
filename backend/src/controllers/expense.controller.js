import expense from "../models/record.model.js";

export const getExpenses = async (req, res) => {
  try {
    const items = await expense.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const addExpense = async (req, res) => {
  try {
    const item = await expense.create(req.body);
    res.json(item);
  } catch (err) {
    console.log("errer: ", err);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    await expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.log("Error: ", err);
  }
};
