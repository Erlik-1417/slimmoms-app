
const { Schema, model } = require('mongoose');

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  { versionKey: false, timestamps: true }
);

const Session = model('session', sessionSchema);

module.exports = { Session };
