
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    roleTags: {
      type: [String], // ['customer', 'vendor', 'agent', 'admin']
      default: ["customer"],
    },
    createdFrom: {
      type: String,
      required: false,
      enum: ["bbscart", "healthcare", "thiaworld"],
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// // Explicitly import ObjectId from mongoose.Schema.Types
// const { ObjectId } = mongoose.Schema.Types;

// const UserSchema = new mongoose.Schema({
//   role: {
//     type: String,
//     enum: [
//       "user",
//       "admin",
//       "seller",
//       "customer",
//       "agent",
//       "territory_head",
//       "franchise_head",
//     ],
//     default: "user",
//   },
//   name: String,
//   email: { type: String, unique: true }, // User's email (unique)
//   password: String, // Encrypted user password
//   refreshToken: String,
//   userdetails: { type: ObjectId, ref: "UserDetails" },
//   created_at: { type: Date, default: Date.now }, // Account creation date
//   updated_at: { type: Date, default: Date.now }, // Last updated date
// });

// const User = mongoose.model("User", UserSchema);
// module.exports = User;
