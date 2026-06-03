const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (email === null && password === null) {
      return res.status(406).json({ msg: "Format not acceptable" });
    }
    const user = await User.findOne({ email });
    return user && res.status(406).json("User already exists");

    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({ msg: "User created succefully", newUser });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const test = async (req, res) => {
  res.json("Hello");
};

module.exports = {
  register,
  test,
};
