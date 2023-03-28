const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
app.use(methodOverride("_method"));
app.use(express.json());

//bring article models

let { Article } = require("./models/article");

// conecting to database and checking for errors
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log("error"));

// setting view engine to ejs
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// set public folder
app.use("/public", express.static("public"));

// Express session middleware

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//express messages middleware

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//passport config
require("./config/passport")(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//home route

app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        title: "Articles",
        articles: articles,
      });
    }
  });
});

// route files
var articles = require("./routes/articlesroutes");
var users = require("./routes/userroutes");
app.use("/article", articles);
app.use("/users", users);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`working on ${PORT}`);
});
