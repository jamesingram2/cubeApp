const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Accessory = require("./Accesory");

const CubeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
   },
   description: {
      type: String,
      required: true,
      maxlength: 2000,
   },
   imageUrl: {
      type: String,
      required: true,
   },
   difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
   },
   accessories: [
      {
         type: "ObjectId",
         ref: "Accessory",
      },
   ],
   creatorId: {
      type: "ObjectId",
      ref: "User",
   },
});

const Cube = mongoose.model("Cube", CubeSchema);
module.exports = Cube;
