const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Cube = require("./Cube");

const AccessorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
      maxLength: 2000,
   },
   imageUrl: {
      type: String,
      required: true,
   },
   cubes: [
      {
         type: "ObjectId",
         ref: "Cube",
      },
   ],
});

const Accessory = mongoose.model("Accessory", AccessorySchema);
module.exports = Accessory;
