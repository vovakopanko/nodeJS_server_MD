const { Schema, model } = require("mongoose");

const LogoGamesSchema = new Schema({
  id: { type: Number },
  alt: { type: String },
  link: { type: String },
  image: { type: String },
});

module.exports = model("LogoGames", LogoGamesSchema);
