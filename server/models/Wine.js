const mongoose = require("mongoose");

const WineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Wine name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Red", "White", "Rose", "Sparkling"],
      required: [true, "Wine type is required"],
    },
    grapeVariety: {
      type: String,
    },
    alcoholContent: {
      type: Number,
      required: [true, "Alcohol content is required"],
      min: 0,
      max: 100,
    },
    vintage: {
      type: Number,
      required: [true, "Vintage (year) is required"],
      min: 1000,
      max: new Date().getFullYear(),
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    winery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Winery",
      required: [true, "Winery is required"],
    },
    description: {
      type: String,
      required: [true, "Wine description is required"],
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const Wine = mongoose.model("Wine", WineSchema);

module.exports = Wine;
