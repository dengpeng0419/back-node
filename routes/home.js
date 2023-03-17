var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Banner = require("../model/banner");
const Category = require("../model/category");
const { forwardAuthenticated } = require("../common/auth");

// list
router.get("/bannerList", forwardAuthenticated, (req, res) => {
  const pageSize = req.pageSize || 10;
  const pageNum = req.page || 1;
  const sortTj = req.sort ? "name" : "_id";
  Banner.find({
    // .sort([[sortTj,parms.sort]])
    /* 可多条件搜索例如：$or: [
        {'description': {'$regex': key, $options: '$i'}},
        {'city': {'$regex': key, $options: '$i'}},
        {'name': {'$regex': key, $options: '$i'}}]
    }) */
    $or: [
      {
        position: {
          $regex: req.position || "",
          $options: "$i",
        }
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
          // total: count,
          msg: "",
        });
      }
    });
});

// list
router.get("/categoryList", forwardAuthenticated, (req, res) => {
  const pageSize = req.pageSize || 10;
  const pageNum = req.page || 1;
  const sortTj = req.sort ? "name" : "_id";
  Category.find({
    $or: [
      {
        position: {
          $regex: req.position || "",
          $options: "$i",
        }
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
          // total: count,
          msg: "",
        });
      }
    });
});

// add
router.post("/addBanner", forwardAuthenticated, (req, res) => {
  console.log("param:", req.body);
  const { name, desc, pic, position = 'home' } = req.body;

  const banner = new Banner({
    name,
    desc,
    pic,
    position
  });
  banner
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

router.post("/addCategory", forwardAuthenticated, (req, res) => {
  console.log("param:", req.body);
  const { name, pic, order } = req.body;

  const category = new Category({
    name,
    pic,
    order
  });
  category
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
router.post("/updateBanner", (req, res) => {
  const { _id, ...rest } = req.body;
  console.log("param:", req.body);

  Banner.findOne({ _id: _id }, function (error, doc) {
    if (!error) {
      Home.updateOne(
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

router.post("/updateCategory", (req, res) => {
  const { _id, ...rest } = req.body;
  console.log("param:", req.body);

  Category.findOne({ _id: _id }, function (error, doc) {
    if (!error) {
      Home.updateOne(
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
router.post("/deleteBanner", (req, res) => {
  Banner.remove(
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

router.post("/deleteBanner", (req, res) => {
  Category.remove(
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
