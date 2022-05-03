const { Schema, model } = require("mongoose");

function makeRandomName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  photoUser: { type: String, default: null },
  userName: { type: String, default: makeRandomName(5) },
  profileDescription: { type: String, default: null },
  address: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  role: { type: String, default: "PLAYER", unique: true },
});

module.exports = model("User", UserSchema); // 1 par - name Model , 2 par - Schema
