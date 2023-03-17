var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// Load
const Product = require("../model/product");
const { forwardAuthenticated, ensureAuthenticated } = require("../common/auth");

// list
router.get("/list", forwardAuthenticated, (req, res) => {
  const pageSize = req.pageSize || 10;
  const pageNum = req.page || 1;
  const sortTj = req.sort ? "name" : "_id";
  Product.find({
    // .sort([[sortTj,parms.sort]])
    /* 可多条件搜索例如：$or: [
        {'description': {'$regex': key, $options: '$i'}},
        {'city': {'$regex': key, $options: '$i'}},
        {'name': {'$regex': key, $options: '$i'}}]
    }) */
    $or: [
      {
        name: {
          $regex: req.name || "",
          $options: "$i",
        },
        label: {
          $regex: req.label || "",
          $options: "$i",
        },
        category: {
          $regex: req.category || "",
          $options: "$i",
        },
      },
    ],
  })
    .sort({
      [sortTj]: req.sort,
    })
    .skip((Number(pageNum) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .exec(function (errList, docsList) {
      console.log(errList);
      Product.count({}, function(err, count){
        if (err) {
          res.send({
            code: 4,
            data: "异常",
            msg: "异常"
          });
        } else {
          res.send({
            code: 0,
            data: docsList,
            total: count,
            msg: "",
          });
        }
      })
    });
});

// add
router.post("/add", forwardAuthenticated, (req, res) => {
  console.log("param:", req.body);
  const { name, desc, price, pic, type, status, category, top, label } = req.body;

  const product = new Product({
    name,
    desc,
    price,
    pic,
    type,
    status,
    category, 
    top, 
    label
  });
  product
    .save()
    .then((doc) => {
      res.send({
        code: 0,
        data: doc,
        // total: all,
        msg: "",
      });
    })
    .catch((err) => console.log(err));
});

// update
router.post("/update", (req, res) => {
  const { _id, ...rest } = req.body;
  console.log("param:", req.body);

  Product.findOne({ _id: _id }, function (error, doc) {
    if (!error) {
      Product.updateOne(
        {
          _id: _id,
        },
        { ...rest },
        function (error, doc) {
          //成功返回1  失败返回0
          if (doc) {
            res.send({
              code: 0,
              data: doc,
              // total: all,
              msg: "",
            });
          }
        }
      );
    } else {
      res.send({
        code: 4,
        data: "商品不存在",
      });
    }
  });
});

// delete
router.post("/delete", (req, res) => {
  Product.remove(
    {
      _id: req._id,
    },
    function (err, docs) {
      // 有删除的数据：result: { ok: 1, n: 1 }   没有删除的数据：result: { ok: 1, n: 0 }
      if (err) {
        res.send({
          code: 4,
          data: "异常",
        });
      } else {
        if (docs.n == 1) {
          res.send({
            code: 0,
            data: docs,
          });
        } else {
          res.send({
            code: 4,
            data: "删除失败",
          });
        }
      }
    }
  );
});

module.exports = router;
