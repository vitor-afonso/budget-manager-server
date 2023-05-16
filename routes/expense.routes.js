// jshint esversion:9

const router = require('express').Router();
const mongoose = require('mongoose');
const Month = require('../models/Month.model');
const Expense = require('../models/Expense.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

/************************** CREATE EXPENSES *********************************/

router.post('/expenses', isAuthenticated, async (req, res, next) => {
  try {
    const { monthId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(monthId)) {
      res.status(401).json({ message: 'Specified monthId is not valid' });
      return;
    }
    let createdExpense = await Expense.create(req.body);

    await Month.findByIdAndUpdate(monthId, { $push: { expenses: createdExpense._id } }, { new: true });

    res.status(200).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong creating expense: ${error.message}` });
  }
});

/************************** GET ONE EXPENSE *********************************/

router.get('/expenses/:expenseId', isAuthenticated, async (req, res, next) => {
  const { expenseId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      res.status(401).json({ message: 'Specified expenseId is not valid' });
      return;
    }
    let oneExpense = await Expense.findById(expenseId);
    res.status(200).json(oneExpense);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong getting one expense from DB: ${error.message}` });
  }
});

/************************** UPDATE EXPENSE *********************************/

router.patch('/expenses/:expenseId', isAuthenticated, async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      res.status(401).json({ message: 'Specified expenseId is not valid' });
      return;
    }
    let response = await Expense.findByIdAndUpdate(expenseId, req.body, { new: true });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong updating expense: ${error.message}` });
  }
});

/************************** DELETE EXPENSE *********************************/

router.delete('/expenses/:expenseId', isAuthenticated, async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      res.status(401).json({ message: 'Specified expenseId is not valid' });
      return;
    }

    const expenseToDelete = await Expense.findByIdAndRemove(expenseId);

    const month = await Month.findById(expenseToDelete.monthId);

    await Month.findByIdAndUpdate(expenseToDelete.monthId, {
      expenses: month.expenses.filter((oneExpense) => {
        return oneExpense.toString() != expenseId;
      }),
    });

    res.status(200).json({ message: `Expense with id: ${expenseId} was deleted and corresponding month expenses successfully updated.` });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong deleting expense: ${error.message}` });
  }
});

module.exports = router;
