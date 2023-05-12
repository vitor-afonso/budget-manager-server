const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    incomes: [{ type: Schema.Types.ObjectId, ref: 'Income' }],
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
