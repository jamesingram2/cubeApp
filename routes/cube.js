const express = require("express");
const router = express.Router();
const Cube = require("../models/Cube");
const jwt = require("jsonwebtoken");
const authAccess = require("../middleware/authAccess");
const userStatus = require("../middleware/userStatus");

// GET create cube page
router.get("/create", authAccess, userStatus, (req, res) => {
   res.render("create", { isLoggedIn: req.isLoggedIn });
});

// POST create cube page
router.post("/create", authAccess, userStatus, async (req, res) => {
   console.log("Create Cube POST");
   const { name, description, imageUrl, difficulty } = req.body;
   const token = req.cookies["access_token"];
   const decodedObject = jwt.verify(token, process.env.SECRET);
   const newCube = new Cube({
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      difficulty: req.body.difficulty,
      accessorries: [],
      creatorId: decodedObject.id,
   });
   await newCube.save((err) => {
      if (err) {
         console.log(err);
         res.redirect("/create");
      } else {
         res.redirect("/");
      }
   });
   console.log("New cube is", newCube);
});

// GET details page
router.get("/details/:id", userStatus, async (req, res) => {
   const id = req.params.id;
   const aCube = await Cube.findOne({ _id: id }).lean();
   await Cube.findOne({ aCube }).populate("accessories");
   console.log("aCube is", aCube);
   res.render("details", {
      title: "Details",
      cube: aCube,
      isLoggedIn: req.isLoggedIn,
   });
});

// GET edit cube page
router.get("/edit/:id", userStatus, authAccess, async (req, res) => {
   const id = req.params.id;
   const aCube = await Cube.findOne({ _id: id }).populate("accessories").lean();
   res.render("edit", {
      title: "Edit Cube",
      cube: aCube,
      isLoggedIn: req.isLoggedIn,
   });
});
// POST edit cube page
router.post("/edit/:id", userStatus, authAccess, async (req, res) => {
   const id = req.params.id;
   const editCube = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      difficulty: req.body.difficulty,
   };
   Cube.findByIdAndUpdate(id, editCube, () => {
      console.log("the cube was edited");
   }).lean();

   res.redirect("/");
});

// GET delete cube page
router.get("/delete/:id", userStatus, authAccess, async (req, res) => {
   const id = req.params.id;
   const aCube = await Cube.findOne({ _id: id }).populate("accessories").lean();
   res.render("delete", {
      title: "Delete",
      cube: aCube,
      isLoggedIn: req.isLoggedIn,
   });
});

// POST delete cube page
router.post("/delete/:id", userStatus, authAccess, async (req, res) => {
   const id = req.params.id;
   Cube.findByIdAndDelete(id, () => {
      console.log("the cube was deleted");
   }).lean();

   res.redirect("/");
});

module.exports = router;
