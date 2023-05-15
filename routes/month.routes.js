// jshint esversion:9

const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Month = require('../models/Month.model');
const { isAuthenticated } = require('./../middleware/jwt.middleware');

/************************** CREATE MONTH *********************************/

router.post('/months', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified userId is not valid' });
      return;
    }

    let createdMonth = await Month.create(req.body);

    await User.findByIdAndUpdate(userId, { $push: { months: createdMonth._id } }, { new: true });

    res.status(200).json(createdMonth);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong creating new month: ${error.message}` });
  }
});

/************************** GET ALL MONTHS *********************************/

router.get('/months/user/:userId', isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified userId is not valid' });
      return;
    }
    const allMonths = await Month.find({ userId: userId, deleted: false }).populate({ path: 'incomes' }).populate({ path: 'expenses' });

    res.status(200).json(allMonths);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong getting months from DB: ${error.message}` });
  }
});

/************************** GET ONE MONTH *********************************/

router.get('/months/:monthId', isAuthenticated, async (req, res, next) => {
  const { monthId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(monthId)) {
      res.status(401).json({ message: 'Specified monthId is not valid' });
      return;
    }

    let oneMonth = await Month.findById(monthId);

    if (oneMonth.incomes.length > 0) {
      oneMonth.populate('incomes');
    }
    if (oneMonth.expenses.length > 0) {
      oneMonth.populate('expenses');
    }
    res.status(200).json(oneMonth);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong getting one month from DB: ${error.message}` });
  }
});

/************************** UPDATE MONTH *********************************/

router.put('/months/:monthId', isAuthenticated, async (req, res, next) => {
  try {
    const { monthId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(monthId)) {
      res.status(401).json({ message: 'Specified monthId is not valid' });
      return;
    }
    let response = await Month.findByIdAndUpdate(monthId, req.body, { new: true });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong updating month: ${error.message}` });
  }
});

/************************** DELETE MONTH *********************************/

router.patch('/months/:monthId', isAuthenticated, async (req, res, next) => {
  try {
    const { monthId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(monthId)) {
      res.status(401).json({ message: 'Specified monthId is not valid' });
      return;
    }

    let deletedMonth = await Month.findByIdAndUpdate(monthId, req.body, { new: true });

    res.status(200).json(deletedMonth);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong deleting month: ${error.message}` });
  }
});

module.exports = router;
