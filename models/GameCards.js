const { Schema, model } = require("mongoose");

const GameCardsSchema = new Schema({
  uniqueId: { type: String },
  title: { type: String },
  price: { type: Number },
  url: { type: String },
  alt: { type: String },
  amountStars: { type: Number },
  age: { type: Number },
  description: { type: String },
  genres: { type: String },
  imagePlatforms: { type: Array },
});

module.exports = model("GameCards", GameCardsSchema);
