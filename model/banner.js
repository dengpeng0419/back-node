var mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  name: { //标题
    type: String,
    required: true
  },
  desc: { //描述
    type: String,
    required: false
  },
  pic: { //图片
    type: Array,
    required: true
  },
  position: { //banner所在位置
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
