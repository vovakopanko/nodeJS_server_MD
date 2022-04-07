const { Schema, model } = require("mongoose");

const CategoriesSchema = new Schema({
  id: { type: Number },
  alt: { type: String },
  title: { type: String },
  image: { type: String },
});

module.exports = model("Categories", CategoriesSchema);
