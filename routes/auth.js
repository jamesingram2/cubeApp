const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = +process.env.SALT;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const userStatus = require("../middleware/userStatus");

// GET registration page
router.get("/register", userStatus, (req, res) => {
   res.render("register", { isLoggedIn: req.isLoggedIn });
});

// POST registration page
router.post("/register", async (req, res) => {
   const { username, password, repeatPassword } = req.body;
   if (password !== repeatPassword) {
      res.send("Passwords do not match");
   } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = new User({
         username,
         password: hash,
      });
      newUser.save((err) => {
         if (err) {
            console.log(err);
            res.redirect("/register");
         } else {
            res.redirect("/login");
         }
      });
   }
});

// GET login page
router.get("/login", userStatus, (req, res) => {
   res.render("login", { isLoggedIn: req.isLoggedIn });
});

// POST login page
router.post("/login", async (req, res) => {
   const { username, password } = req.body;
   const user = await User.findOne({ username });
   const status = await bcrypt.compare(password, user.password);
   console.log("Status is:", status);

   if (status) {
      // generate token
      const token = jwt.sign(
         { id: user._id, username: user.username },
         process.env.SECRET
      );
      res.cookie("access_token", token);
   } else {
      console.log("Invalid Login");
   }
   res.redirect("/");
});

module.exports = router;
