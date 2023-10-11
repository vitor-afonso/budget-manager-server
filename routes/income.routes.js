// jshint esversion:9

const router = require('express').Router();
const mongoose = require('mongoose');
const Month = require('../models/Month.model');
const Income = require('../models/Income.model');
const { isAuthenticated } = require('./../middleware/jwt.middleware');

/************************** CREATE INCOME *********************************/

router.post('/incomes', isAuthenticated, async (req, res, next) => {
  try {
    const { monthId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(monthId)) {
      res.status(401).json({ message: 'Specified monthId is not valid' });
      return;
    }
    let createdIncome = await Income.create({
      ...req.body,
      createdAt: req.body.creationDate,
    });

    await Month.findByIdAndUpdate(
      monthId,
      { $push: { incomes: createdIncome._id } },
      { new: true },
    );

    res.status(200).json(createdIncome);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Something went wrong creating income: ${error.message}`,
      });
  }
});

/************************** GET ONE INCOME *********************************/

router.get('/incomes/:incomeId', isAuthenticated, async (req, res, next) => {
  const { incomeId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(incomeId)) {
      res.status(401).json({ message: 'Specified incomeId is not valid' });
      return;
    }
    let oneIncome = await Income.findById(incomeId);
    res.status(200).json(oneIncome);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Something went wrong getting one income from DB: ${error.message}`,
      });
  }
});

/************************** UPDATE INCOME *********************************/

router.patch('/incomes/:incomeId', isAuthenticated, async (req, res, next) => {
  try {
    const { incomeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(incomeId)) {
      res.status(401).json({ message: 'Specified incomeId is not valid' });
      return;
    }
    let response = await Income.findByIdAndUpdate(incomeId, req.body, {
      new: true,
    });

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Something went wrong updating income: ${error.message}`,
      });
  }
});

/************************** DELETE INCOME *********************************/

router.delete('/incomes/:incomeId', isAuthenticated, async (req, res, next) => {
  try {
    const { incomeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(incomeId)) {
      res.status(401).json({ message: 'Specified incomeId is not valid' });
      return;
    }

    const incomeToDelete = await Income.findByIdAndRemove(incomeId);

    const month = await Month.findById(incomeToDelete.monthId);

    await Month.findByIdAndUpdate(incomeToDelete.monthId, {
      incomes: month.incomes.filter((oneIncome) => {
        return oneIncome.toString() != incomeId;
      }),
    });

    res
      .status(200)
      .json({
        message: `Income with id: ${incomeId} was deleted and corresponding month incomes successfully updated.`,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Something went wrong deleting income: ${error.message}`,
      });
  }
});

module.exports = router;
