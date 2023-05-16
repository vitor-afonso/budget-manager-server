const { Schema, model } = require('mongoose');

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
    },
    monthId: { type: Schema.Types.ObjectId, ref: 'Month' },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Expense', expenseSchema);
