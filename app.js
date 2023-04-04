var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var lessMiddleware = require("less-middleware");
var logger = require("morgan");
var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");
const multer = require("multer");
const bodyParser = require("body-parser");
var app = express();
var mongoose = require("./common/mongoose");

var indexRouter = require("./routes/index");
var mockRouter = require("./routes/mock");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/product");
var homeRouter = require("./routes/home");
var cartRouter = require("./routes/cart");
var colorRouter = require("./routes/color");

// Passport Config
require("./common/passport")(passport);

var db = mongoose();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, "public")));

//配置静态资源文件
app.use(express.static("../upload"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    dest: "/tmp/",
    fileFilter(req, file, callback) {
      // 解决中文名乱码的问题
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      callback(null, true);
    },
  }).array("file")
);

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);
app.use("/mock", mockRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/home", homeRouter);
app.use("/cart", cartRouter);
app.use("/color", colorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
