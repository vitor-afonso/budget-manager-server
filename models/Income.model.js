const { Schema, model } = require('mongoose');

const incomeSchema = new Schema(
  {
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
  },
);

module.exports = model('Income', incomeSchema);
