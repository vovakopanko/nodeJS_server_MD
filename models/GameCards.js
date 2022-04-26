const { Schema, model } = require("mongoose");

const GameCardsSchema = new Schema({
  title: { type: String },
  prise: { type: String },
  url: { type: String },
  alt: { type: String },
  amountStars: { type: Number },
  age: { type: String },
  description: { type: String },
  genres: { type: String },
});

module.exports = model("GameCards", GameCardsSchema);
