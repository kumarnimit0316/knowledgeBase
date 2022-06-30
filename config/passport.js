const localstrategy = require("passport-local").Strategy;
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = (passport) => {
  //local startegy
  passport.use(
    new localstrategy((username, password, done) => {
      // match username
      let query = { username: username };
      User.findOne(query, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false, {
            message: "No user found",
            type: "danger",
          });
        }

        //match password
        bcrypt.compare(password, user.password, (err, ismatch) => {
          if (err) throw err;
          if (ismatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "wrong password",
              type: "danger",
            });
          }
        });
      });
    })
  );
  passport.serializeUser(function (user, done) {
    process.nextTick(function () {
      done(null, { id: user.id, name: user.name, username: user.username });
    });
  });

  passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, user);
    });
  });
};
