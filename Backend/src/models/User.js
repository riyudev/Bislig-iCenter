import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    password: {
      type: String,

      required: true,

      minlength: 6,

      select: false,
    },

    role: {
      type: String,

      enum: ["user", "admin"],

      default: "user",
    },

    isOnline: {
      type: Boolean,

      default: false,
    },

    lastSeenAt: {
      type: Date,
    },

    mobileNumber: {
      type: String,

      trim: true,

      default: "",
    },

    address: {
      type: String,

      trim: true,

      default: "",
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;

    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
