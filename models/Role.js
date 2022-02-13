const { Schema, model } = require("mongoose");

const Role = new Schema({
  roles: { type: String, unique: true, default: "PLAYER" },
});

module.exports = model("Role", Role);
