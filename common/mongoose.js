var mongoose = require("mongoose");
var config = require("../config");

module.exports = function () {
  var db = mongoose.connect(config.mongodb);
  mongoose.connection.on('connected',()=>{console.log('MongoDB Connected');})
  require("../model/user.js");

  return db;
};
