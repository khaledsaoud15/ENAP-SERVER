const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "This field is required"],
    },

    email: {
      type: String,
      required: [true, "This field is required"],
    },

    password: {
      type: String,
      required: [true, "This field is required"],
    },
    role: {
      type: String,
      required: [true, "this field is required"],
      default: "user",
    },
    deviceToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
