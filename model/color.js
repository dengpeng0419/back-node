var mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String || Number,
    required: true
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  createBy: {
    type: String,
    required: false
  }
});

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;
