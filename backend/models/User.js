const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userDB = require("../config/userDB"); // ✅ This connection goes to BBSCartLocal1

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String], // e.g., ["user", "healthcare"]
      default: ["user"],
    },
    createdFrom: {
      type: String, // e.g., "healthcare", "thiaworld", "bbscart"
      required: true,
    },
    referralCode: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Auto-hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Method to compare entered password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = userDB.model("User", UserSchema);


// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   phone: { type: String, required: true },
//   password: { type: String, required: true },
//   userdetails: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "UserDetails", // must match your model name
//   },
//   role: { type: String, enum: ["admin", "user"], default: "user" },
// });

// // ✅ Log and export using shared auth DB
// const User = mongoose.model("User", userSchema);
// module.exports = User;
