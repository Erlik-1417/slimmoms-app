
const { Schema, model } = require('mongoose');

const daySchema = new Schema(
  {
    date: {
      type: String, 
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    eatenProducts: [
      {
        title: String,
        weight: Number,
        kcal: Number,
        id: String
      }
    ],
    daySummary: {
      date: String,
      kcalLeft: { type: Number, default: 0 },
      kcalConsumed: { type: Number, default: 0 },
      dailyRate: { type: Number, default: 0 },
      percentsOfDailyRate: { type: Number, default: 0 }
    }
  },
  { versionKey: false, timestamps: true }
);

const Day = model('day', daySchema);

module.exports = { Day };
