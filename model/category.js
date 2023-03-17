var mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { //标题
    type: String,
    required: true
  },
  pic: { //图片
    type: String,
    required: true
  },
  order: { //顺序
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
