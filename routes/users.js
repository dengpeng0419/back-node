var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
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
router.get("/list", ensureAuthenticated, (req, res) => {
  const pageSize = req.pageSize || 10;
  const pageNum = req.page || 1;
  const sortTj = req.userSort ? 'name' : '_id';
  User
    .find({
      // .sort([[sortTj,parms.userSort]])
      /* 可多条件搜索例如：$or: [
        {'description': {'$regex': key, $options: '$i'}},
        {'city': {'$regex': key, $options: '$i'}},
        {'name': {'$regex': key, $options: '$i'}}]
    }) */
      $or: [
        {
          name: {
            $regex: req.search || '',
            $options: "$i",
          },
        },
      ],
    })
    .sort({
      [sortTj]: req.userSort,
    })
    .skip((Number(pageNum) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .exec(function (errList, docsList) {
      console.log(errList)
      User.count({}, function (error, count) {
        if (error) {
          res.send({
            code: 4,
            data: "异常",
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

// Register
router.post("/register", (req, res) => {
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
router.post("/delete", (req, res) => {
  User.remove({
		_id: req._id
	}, function (err, docs) {
		// 有删除的数据：result: { ok: 1, n: 1 }   没有删除的数据：result: { ok: 1, n: 0 }
		if (err) {
			res.send({
				code: 4,
				data: '异常'
			})
		} else {
			if (docs.n == 1) {
				res.send({
					code: 0,
					data: docs
				})
			} else {
				res.send({
					code: 4,
					data: '删除失败'
				})
			}
		}
	});
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
