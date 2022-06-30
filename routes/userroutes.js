const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Express Validator middleware
const { check, validationResult } = require("express-validator");

//Bring in user model
let { User } = require("../models/user");

//register form
router.get("/register", (req, res) => {
  res.render("register");
});

//registering process
router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "email is required").notEmpty(),
    check("email", "Enter correct email").isEmail(),
    check("username", "Username is required").notEmpty(),
    check("password", "password is required").notEmpty(),
    check("password2", "passwords do not match").custom(
      (value, { req }) => value == req.body.password
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.array();
      res.render("register", {
        err,
      });
    } else {
      const name = req.body.name;
      const email = req.body.email;
      const username = req.body.username;
      const password = req.body.password;
      let newuser = new User({
        name: name,
        email: email,
        username: username,
        password: password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newuser.password, salt, (err, hash) => {
          if (err) {
            req.flash("danger", "error in registering please try again");
            return;
          }
          newuser.password = hash;
          newuser.save((err) => {
            if (err) {
              req.flash("danger", "error in registering please try again");
              return;
            } else {
              req.flash("success", "Your are now register and can login");
              res.redirect("/users/login");
            }
          });
        });
      });
    }
  }
);

// login form

router.get("/login", (req, res) => {
  res.render("login");
});

//login process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//logout process

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "your are logged out successfully");
  res.redirect("/users/login");
});

module.exports = router;
