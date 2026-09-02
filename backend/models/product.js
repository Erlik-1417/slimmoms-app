
const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    categories: [String],
    weight: Number,
    title: { type: Schema.Types.Mixed },
    calories: Number,
    groupBloodNotAllowed: {
      1: Boolean,
      2: Boolean,
      3: Boolean,
      4: Boolean
    }
  },
  { versionKey: false, timestamps: true }
);

const Product = model('product', productSchema);

module.exports = { Product };
