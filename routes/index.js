const express = require("express");
const router = express.Router();
const userStatus = require("../middleware/userStatus");
const Cube = require("../models/Cube");

// GET home page
router.get("/", userStatus, async (req, res) => {
   const cubes = await Cube.find().lean();
   res.render("index", { isLoggedIn: req.isLoggedIn, cubes });
});

// GET search results
router.get("/search", userStatus, async (req, res) => {
   let cubes;
   let from;
   let to;
   if (!req.query.from || req.query.from < 1) {
      from = 1;
   } else {
      from = req.query.from;
   }
   if (!req.query.to || req.query.to > 6) {
      to = 6;
   } else {
      to = req.query.to;
   }

   if (!req.query.search) {
      cubes = await Cube.find({
         difficulty: { $gte: from, $lte: to },
      }).lean();
   } else {
      let cubeName = req.query.search;
      cubes = await Cube.find({
         name: cubeName,
         difficulty: { $gte: from, $lte: to },
      }).lean();
   }
   res.render("index", { isLoggedIn: req.isLoggedIn, cubes });
});

// GET about page
router.get("/about", userStatus, (req, res) => {
   res.render("about", { title: "About", isLoggedIn: req.isLoggedIn });
});

// GET logout page
router.get("/logout", (req, res) => {
   res.clearCookie("access_token");
   res.redirect("/");
});

module.exports = router;
