const express = require("express");
const router = express.Router();
const authAccess = require("../middleware/authAccess");
const userStatus = require("../middleware/userStatus");
const Cube = require("../models/Cube");
const Accessory = require("../models/Accesory");

// GET create accessory page
router.get("/create/accessory", authAccess, userStatus, async (req, res) => {
   const accessories = await Accessory.find().lean();
   res.render("createAccessory", {
      title: "Create Accessory",
      isLoggedIn: req.isLoggedIn,
      accessories,
   });
});

// POST create accessory page
router.post("/create/accessory", authAccess, userStatus, async (req, res) => {
   const { name, description, imageUrl } = req.body;
   const accessory = new Accessory({ name, description, imageUrl });
   await accessory.save();
   res.redirect("/");
});

// GET accessory details page
router.get("/details/accessory/:id", userStatus, async (req, res) => {
   const id = req.params.id;
   const acc = await Accessory.findOne({ _id: id }).lean();
   res.render("accessoryDetails", {
      title: "Accessory Details",
      accessory: acc,
      isLoggedIn: req.isLoggedIn,
   });
});

// GET attach accessory page
router.get("/attach/:id", authAccess, userStatus, async (req, res) => {
   const id = req.params.id;
   const aCube = await Cube.findById({ _id: id }).lean();
   const accessories = await Accessory.find().lean();
   res.render("attachAccessory", {
      title: "Attach Accessory",
      ...aCube,
      accessories,
      isFull: false,
      isLoggedIn: req.isLoggedIn,
   });
});

// POST attach accessory page
router.post("/attach/:id", authAccess, userStatus, async (req, res) => {
   const id = req.params.id;
   const { accessory } = req.body;
   const updateCube = async (id, accessoryId) => {
      await Cube.findByIdAndUpdate(id, {
         $addToSet: {
            accessories: [accessoryId],
         },
      })
         .populate("accessories")
         .lean();
   };
   await updateCube(id, accessory);

   res.redirect(`/details/${id}`);
});

module.exports = router;
