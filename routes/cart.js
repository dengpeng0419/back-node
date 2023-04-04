var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var moment = require("moment");
// Load
const Cart = require("../model/cart");
const { forwardAuthenticated, ensureAuthenticated } = require("../common/auth");

// list
router.post("/list", forwardAuthenticated, (req, res) => {
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.current || 1;
  const sortTj = req.body.sort ? "name" : "_id";
  const name = req.body.name || "";
  const userId = req.body.userId || "";
  const status = req.body.status || "";
  console.log(req.body);
  Cart.find({
    // .sort([[sortTj,parms.sort]])
    /* 可多条件搜索例如：$or: [
        {'description': {'$regex': key, $options: '$i'}},
        {'city': {'$regex': key, $options: '$i'}},
        {'name': {'$regex': key, $options: '$i'}}]
    }) */
    $or: [
      { name: { $regex: name, $options: "$i" } },
      { userId: { $regex: userId, $options: "$i" } },
      { status: { $regex: status, $options: "$i" } },
    ],
  })
    .sort({
      [sortTj]: -1,
    })
    .skip((Number(pageNum) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .exec(function (errList, docsList) {
      console.log(errList, docsList);
      const list = docsList?.map((item) => {
        return {
          _id: item._id,
          userId: item.uerId,
          goodsId: item.goodsId,
          name: item.name,
          desc: item.desc,
          price: item.price,
          pic: item.pic,
          detail: item.detail,
          status: item.status,
          createTime: moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          createBy: item.createBy,
        };
      });
      Cart.count({}, function (err, count) {
        if (err) {
          res.send({
            code: 4,
            data: "异常",
            msg: "异常",
          });
        } else {
          res.send({
            code: 200,
            rows: list,
            total: count,
            msg: "",
          });
        }
      });
    });
});

// getGoodsCount
router.post("/getGoodsCount", forwardAuthenticated, (req, res) => {
  const userId = req.body.userId || "";
  const status = req.body.status || "";
  console.log(req.body);
  Cart.count({userId, status}, function (err, count) {
    if (err) {
      res.send({
        code: 4,
        data: "异常",
        msg: "异常",
      });
    } else {
      res.send({
        code: 200,
        total: count,
        msg: "",
      });
    }
  });
});

// add
router.post("/add", forwardAuthenticated, (req, res) => {
  console.log("param:", req.body);
  const { userId, goodsId, name, desc, price, pic, color, type, number, status } =
    req.body;

  Cart.findOne({ userId, goodsId }, function (error, doc) {
    if (!error) {
      //存在就更新
      const newDetail = [];
      const oldDetail = doc.detail || [];
      oldDetail.map((item) => {
        if (item.color === color && item.type === type) {
          newDetail.push({ color, type, number: number + item.number });
        } else {
          newDetail.push(item);
        }
      });
      Cart.updateOne(
        {
          _id: doc._id,
        },
        {
          name,
          desc,
          price,
          pic,
          status,
          detail: newDetail,
        },
        function (error, doc) {
          //成功返回1  失败返回0
          if (doc) {
            res.send({
              code: 200,
              data: doc,
              // total: all,
              msg: "",
            });
          }
        }
      );
    } else {
      //不存在新建
      const cart = new Cart({
        userId,
        goodsId,
        name,
        desc,
        price,
        pic,
        detail: [{ color, type, number }],
        createBy: "管理员",
      });
      cart
        .save()
        .then((doc) => {
          res.send({
            code: 200,
            data: doc,
            // total: all,
            msg: "",
          });
        })
        .catch((err) => console.log(err));
    }
  });
});

// update
router.post("/update", (req, res) => {
  const { _id, color, type, number } = req.body;
  console.log("param:", req.body);

  Cart.findOne({ _id: _id }, function (error, doc) {
    if (!error) {
      const newDetail = [];
      const oldDetail = doc.detail || [];
      oldDetail.map((item) => {
        if (item.color === color && item.type === type) {
          newDetail.push({ color, type, number: number + item.number });
        } else {
          newDetail.push(item);
        }
      });
      Cart.updateOne(
        {
          _id: _id,
        },
        {
          detail: newDetail,
        },
        function (error, doc) {
          //成功返回1  失败返回0
          if (doc) {
            res.send({
              code: 200,
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
        data: "不存在",
      });
    }
  });
});

// delete
router.post("/delete", (req, res) => {
  Cart.remove(
    {
      _id: req.body._id,
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
            code: 200,
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

// batch delete
router.post("/deleteBatch", forwardAuthenticated, (req, res) => {
  const idArray = req.body.ids || [];
  console.log(req.body);
  Cart.deleteMany(
    {
      _id: { $in: idArray },
    },
    function (err, docs) {
      // 有删除的数据：result: { ok: 1, n: 1 }   没有删除的数据：result: { ok: 1, n: 0 }
      console.log(err, docs);
      if (err) {
        res.send({
          code: 4,
          msg: "异常",
        });
      } else {
        if (docs.n >= 1) {
          res.send({
            code: 200,
            // data: docs,
            msg: "删除成功",
          });
        } else {
          res.send({
            code: 4,
            msg: "删除失败",
          });
        }
      }
    }
  );
});

// submit
router.post("/submit", forwardAuthenticated, (req, res) => {
  const idArray = req.body.ids || [];
  console.log(req.body);
  Cart.updateMany(
    {
      _id: { $in: idArray },
    },
    {
      $set: { status: '1' }
    },
    function (err, docs) {
      console.log(err, docs);
      if (err) {
        res.send({
          code: 4,
          msg: "异常",
        });
      } else {
        if (docs.n >= 1) {
          res.send({
            code: 200,
            // data: docs,
            msg: "提交成功",
          });
        } else {
          res.send({
            code: 4,
            msg: "提交失败",
          });
        }
      }
    }
  );
});

module.exports = router;
