
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    userData: {
      weight: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      age: { type: Number, default: 0 },
      bloodType: { type: Number, default: 1 },
      desiredWeight: { type: Number, default: 0 },
      dailyRate: { type: Number, default: 0 },
      notAllowedProducts: { type: [String], default: [] }
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model('user', userSchema);

module.exports = { User };
