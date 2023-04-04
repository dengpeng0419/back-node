var mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { //用户id
    type: String,
    required: true
  },
  goodsId: { //商品id
    type: String,
    required: true
  },
  name: { //商品名
    type: String,
    required: true
  },
  desc: { //商品描述
    type: String,
    required: false
  },
  price: { //价格
    type: String,
    required: true
  },
  pic: { //图片
    type: String,
    required: true
  },
  detail: { //颜色、规格、数量
    type: Array,
    required: true
  },
  status: { //提交状态，0未提交，1已提交
    type: String,
    required: true
  },
  // type: { //规格
  //   type: String,
  //   required: true
  // },
  // color: { //颜色
  //   type: String,
  //   required: true
  // },
  createTime: {
    type: Date,
    default: Date.now
  },
  createBy: {
    type: String,
    required: false
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
