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
    months: [{ type: Schema.Types.ObjectId, ref: 'Month' }],
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
