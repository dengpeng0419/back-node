var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var moment = require("moment");
// Load
const Product = require("../model/product");
const { forwardAuthenticated, ensureAuthenticated } = require("../common/auth");

// list
router.post("/list", forwardAuthenticated, (req, res) => {
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.current || 1;
  const sortTj = req.body.sort ? "name" : "_id";
  const name = req.body.name || "";
  const label = req.body.label || "";
  const category = req.body.category || "";
  console.log(req.body);
  Product.find({
    // .sort([[sortTj,parms.sort]])
    /* 可多条件搜索例如：$or: [
        {'description': {'$regex': key, $options: '$i'}},
        {'city': {'$regex': key, $options: '$i'}},
        {'name': {'$regex': key, $options: '$i'}}]
    }) */
    $or: [
      { name: { $regex: name, $options: "$i" } },
      { label: { $regex: label, $options: "$i" } },
      { category: { $regex: category, $options: "$i" } },
    ],
  })
    .sort({
      [sortTj]: -1,
    })
    .skip((Number(pageNum) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .exec(function (errList, docsList) {
      console.log(errList, docsList);
      const products = docsList?.map((item) => {
        return {
          _id: item._id,
          name: item.name,
          desc: item.desc,
          price: item.price,
          pic: item.pic,
          type: item?.type?.split(',') || undefined,
          color: item?.color?.split(',') || undefined,
          status: item.status,
          category: item.category,
          top: item.top,
          label: item?.label ? item.label?.split(',') : undefined,
          createTime: moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          createBy: item.createBy,
        };
      });
      Product.count({}, function (err, count) {
        if (err) {
          res.send({
            code: 4,
            data: "异常",
            msg: "异常",
          });
        } else {
          res.send({
            code: 200,
            rows: products,
            total: count,
            msg: "",
          });
        }
      });
    });
});

// add
router.post("/add", forwardAuthenticated, (req, res) => {
  console.log("param:", req.body);
  const { name, desc, price, pic, type, status, category, top, label, color } =
    req.body;
  const files = pic?.map((the) => {
    const origin = req.headers.origin || '';
    const domain = origin.includes('localhost') ? 'http://localhost:3333/' : 'http://124.222.99.89:56578/upload/';
    const fileName = !the.response ? `${domain}${the.name}` : `${domain}${moment().format('YYYYMMDD')}_${the.name}`;
    return {
      uid: the?.uid,
      size: the?.size,
      type: the?.type,
      name: the?.response?.data?.filename || the?.name,
      thumbUrl: fileName
    };
  });

  const product = new Product({
    name,
    desc,
    price,
    pic: files,
    type: type?.join(",") || "",
    color: color?.join(",") || "",
    status,
    category,
    top,
    label: label?.join(",") || "",
    createBy: "管理员",
  });
  product
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
});

// update
router.post("/update", (req, res) => {
  const { _id, name, desc, price, pic, type, status, category, top, label, color } =
    req.body;
  console.log("param:", req.body);
  const files = pic?.map((the) => {
    const origin = req.headers.origin || '';
    const domain = origin.includes('localhost') ? 'http://localhost:3333/' : 'http://124.222.99.89:56578/upload/';
    const fileName = !the.response ? `${domain}${the.name}` : `${domain}${moment().format('YYYYMMDD')}_${the.name}`;
    return {
      uid: the?.uid,
      size: the?.size,
      type: the?.type,
      name: the?.response?.data?.filename || the?.name,
      thumbUrl: fileName
    };
  });

  Product.findOne({ _id: _id }, function (error, doc) {
    if (!error) {
      Product.updateOne(
        {
          _id: _id,
        },
        {
          name,
          desc,
          price,
          pic: files,
          type: type?.join(",") || "",
          color: color?.join(",") || "",
          status,
          category,
          top,
          label: label?.join(",") || ""
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
        data: "商品不存在",
      });
    }
  });
});

// detail
router.post("/detail", (req, res) => {
  const { _id } = req.body;
  console.log("param:", req.body);

  Product.findOne({ _id: _id }, function (error, doc) {
    if (!error) {
      res.send({
        code: 200,
        detail: doc,
        msg: "",
      });
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
  Product.deleteMany(
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

module.exports = router;
