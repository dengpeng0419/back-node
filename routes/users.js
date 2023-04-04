var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
var moment = require('moment');
// Load User model
const User = require("../model/user");
const { forwardAuthenticated, ensureAuthenticated } = require("../common/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

// user list
router.post("/list", forwardAuthenticated, (req, res) => {
  console.log(req.body);
  const pageSize = req.body.pageSize || 10;
  const pageNum = req.body.current || 1;
  const sortTj = req.body.sort ? "name" : "_id";
  const phone = req.body.phone || "";
  const name = req.body.name || "";
  const status = req.body.status || "";
  User.find({
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
        phone: {
          $regex: phone,
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
      const users = docsList?.map((item) => {
        return {
          _id: item._id,
          name: item.name,
          phone: item.phone,
          createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
          password: item.password,
          status: item.status,
          createBy: item.createBy
        };
      });
      User.count({}, function (error, count) {
        if (error) {
          res.send({
            code: 4,
            data: "异常",
          });
        } else {
          res.send({
            code: 200,
            rows: users,
            total: count,
            msg: "",
          });
        }
      });
    });
});

// add
router.post("/add", forwardAuthenticated, (req, res) => {
  const { name, phone, password, status } = req.body;
  console.log(name, phone, password, status)
  let errors = [];

  if (!name || !phone || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }

  if (errors.length > 0) {
    res.send({
      code: 4,
      data: "异常",
    });
  } else {
    User.findOne({ phone: phone }).then((user) => {
      if (user) {
        errors.push({ msg: "phone already exists" });
        res.send({
          code: 4,
          msg: "手机号已经被占用",
        });
      } else {
        const newUser = new User({
          name,
          phone,
          password,
          status,
          createBy: '管理员'
        });

        newUser
          .save()
          .then((user) => {
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
  const { _id, name, phone, password, status } = req.body;
  let errors = [];

  if (!name || !phone || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.send({
      code: 4,
      data: "异常",
    });
  } else {
    User.findOne({ _id: _id }).then((doc) => {
      if (doc) {
        User.updateOne(
          {
            _id: _id,
          },
          { name, phone, password, status },
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
          data: "用户不存在",
        });
      }
    });
  }
});

// register
router.post("/register", forwardAuthenticated, (req, res) => {
  const { name, phone, password, password2 } = req.body;
  let errors = [];

  if (!name || !phone || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      phone,
      password,
      password2,
    });
  } else {
    User.findOne({ phone: phone }).then((user) => {
      if (user) {
        errors.push({ msg: "phone already exists" });
        res.render("register", {
          errors,
          name,
          phone,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          phone,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// delete
router.post("/delete", forwardAuthenticated, (req, res) => {
  User.remove(
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
  User.deleteMany(
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

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});

module.exports = router;
