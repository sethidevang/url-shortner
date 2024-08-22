const mongoose = require("mongoose");

const urlScheme = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamps: {
          type: Number,
          required: true,
        }
      }
    ],
  },
  { timestamps: true }
);
const url = mongoose.model("url", urlScheme);
module.exports = url;
