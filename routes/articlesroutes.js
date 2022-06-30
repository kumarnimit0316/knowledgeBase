const express = require("express");
const router = express.Router();

// Express Validator middleware
const { check, validationResult } = require("express-validator");

//bring article models
let { Article } = require("../models/article");

//bring user models
let { User } = require("../models/user");

//add route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_article", {
    title: "Add Articles",
  });
});

//add submit POST route
router.post(
  "/add",
  [
    check("title", "title is empty").notEmpty(),
    check("body", "body is empty").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array();
      res.render("add_article", {
        title: "Add Article",
        err,
      });
    } else {
      var article = new Article();
      article.title = req.body.title;
      article.author = req.user.id;
      article.au = req.user.name;
      article.body = req.body.body;
      article.date = new Date();
      article.save((err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash("success", "article added");
          res.redirect("/");
        }
      });
    }
  }
);

// load edit form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("edit_article", {
      title: "edit article",
      article: article,
    });
  });
});

//update submit POST route
router.post("/edit/:id", (req, res) => {
  var article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.auth = req.body.auth;
  article.body = req.body.body;
  article.date = new Date();
  var query = { _id: req.params.id };
  Article.updateOne(query, article, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "article updated");
      res.redirect("/");
    }
  });
});

//delete
router.delete("/delete/:id", (req, res) => {
  Article.findById(req.params.id).deleteOne((err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("danger", "article deleted");
      res.redirect("/");
    }
  });
});

// get single article
router.get("/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render("article", {
        article: article,
      });
    });
  });
});

//access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}
module.exports = router;
