var mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { //标题
    type: String,
    required: true
  },
  desc: { //描述
    type: String,
    required: false
  },
  price: { //价格
    type: String,
    required: true
  },
  pic: { //图片
    type: Array,
    required: true
  },
  type: { //规格
    type: Array,
    required: true
  },
  status: { //在售状态, 1在售
    type: Number,
    required: true
  },
  category: { //分类
    type: String,
    required: true
  },
  label: { //标签
    type: String,
    required: false
  },
  top: { //置顶
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
