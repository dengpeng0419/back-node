var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
var moment = require('moment');
// Load model
const Color = require("../model/color");
const { forwardAuthenticated, ensureAuthenticated } = require("../common/auth");

// list
router.post("/list", forwardAuthenticated, (req, res) => {
  console.log(req.body);
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.current || 1;
  const sortTj = req.body.sort ? "name" : "_id";
  const name = req.body.name || "";
  const status = req.body.status || "";
  Color.find({
    // .sort([[sortTj,parms.userSort]])
    /* 可多条件搜索例如：$or: [
        {'description': {'$regex': key, $options: '$i'}},
        {'city': {'$regex': key, $options: '$i'}},
        {'name': {'$regex': key, $options: '$i'}}]
    }) */
    $or: [
      {
        name: {
          $regex: name,
          $options: "$i",
        },
        status: {
          $regex: status,
          $options: "$i",
        },
      },
    ],
  })
    .sort({
      [sortTj]: -1,
    })
    .skip((Number(pageNum) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .exec(function (errList, docsList) {
      console.log(errList);
      const list = docsList?.map((item) => {
        return {
          _id: item._id,
          name: item.name,
          createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
          status: item.status,
          createBy: item.createBy
        };
      });
      Color.count({}, function (error, count) {
        if (error) {
          res.send({
            code: 4,
            data: "异常",
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

// add
router.post("/add", forwardAuthenticated, (req, res) => {
  const { name, status } = req.body;
  console.log(name, status)
  let errors = [];

  if (errors.length > 0) {
    res.send({
      code: 4,
      data: "异常",
    });
  } else {
    Color.findOne({ name: name }).then((doc) => {
      if (doc) {
        errors.push({ msg: "name already exists" });
        res.send({
          code: 4,
          msg: "颜色已经被占用",
        });
      } else {
        const newObj = new Color({
          name,
          status,
          createBy: '管理员'
        });

        newObj
          .save()
          .then((doc) => {
            req.flash("success_msg", "You are now registered and can log in");
            res.send({
              code: 200,
              msg: "添加成功",
            });
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

// update
router.post("/update", forwardAuthenticated, (req, res) => {
  const { _id, name, status } = req.body;
  let errors = [];

  if (errors.length > 0) {
    res.send({
      code: 4,
      data: "异常",
    });
  } else {
    Color.findOne({ _id: _id }).then((doc) => {
      if (doc) {
        Color.updateOne(
          {
            _id: _id,
          },
          { name, status },
          function (error, doc) {
            //成功返回1  失败返回0
            if (doc) {
              res.send({
                code: 200,
                // data: doc,
                // total: all,
                msg: "更新成功",
              });
            }
          }
        );
      } else {
        res.send({
          code: 4,
          data: "颜色不存在",
        });
      }
    });
  }
});

// delete
router.post("/delete", forwardAuthenticated, (req, res) => {
  Color.remove(
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

// batch delete
router.post("/deleteBatch", forwardAuthenticated, (req, res) => {
  // { _id: { $in: ['aID', 'bID'] } }
  const idArray = req.body.ids || [];
  console.log(req.body)
  Color.deleteMany(
    {
      _id: { $in: idArray }
    },
    function (err, docs) {
      // 有删除的数据：result: { ok: 1, n: 1 }   没有删除的数据：result: { ok: 1, n: 0 }
      console.log(err, docs)
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
            msg: '删除成功'
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

module.exports = router;
