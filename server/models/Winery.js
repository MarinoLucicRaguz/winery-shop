const mongoose = require("mongoose");

const WinerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Winery name is required"],
      unique: true,
    },
    foundingYear: {
      type: Number,
      required: [true, "Founding year is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 500,
    },
    logoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Winery = mongoose.model("Winery", WinerySchema);

module.exports = Winery;
