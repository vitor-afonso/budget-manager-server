const { Schema, model } = require('mongoose');

const monthSchema = new Schema(
  {
    incomes: [{ type: Schema.Types.ObjectId, ref: 'Income' }],
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'userId is required.'] },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Month', monthSchema);
