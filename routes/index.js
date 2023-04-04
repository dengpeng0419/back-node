var express = require("express");
const fs = require("fs");
var moment = require('moment');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../common/auth");

/* GET home page. */
router.get("/", forwardAuthenticated, function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/upload", ensureAuthenticated, function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname.replace("routes", "views") + "/upload.html");
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user,
  })
);

router.post("/fileUpload", forwardAuthenticated, (req, res) => {
  const today = moment().format('YYYYMMDD');
  var fileUrl =
    __dirname.replace("back-node/routes", `upload/${today}_`) + req.files[0].originalname; //文件名
  console.log(fileUrl);
  fs.readFile(req.files[0].path, (err, r) => {
    fs.writeFile(fileUrl, r, (err) => {
      //文件写入
      if (err) {
        console.log(err);
        res.send({
          code: 4,
          msg: err,
        });
      } else {
        // 文件上传成功，respones给客户端
        response = {
          message: "File uploaded successfully",
          filename: `${today}_` + req.files[0].originalname,
        };
        res.send({
          code: 200,
          data: response,
          msg: "",
        });
        console.log(response.filename, fileUrl);
      }
    });
  });
});

module.exports = router;
