const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  photoUser: { type: String, default: null },
  userName: { type: String, default: null },
  profileDescription: { type: String, default: null },
  address: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});

module.exports = model("User", UserSchema); // 1 par - name Model , 2 par - Schema
