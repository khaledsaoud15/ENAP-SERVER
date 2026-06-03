const { register } = require("../controllers/user.controller");
const { verifyAdmin } = require("../middlewares/token");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = require("express").Router();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (email === null && password === null) {
      return res.status(406).json({ msg: "Format not acceptable" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(406).json({ msg: "user already exists" });
    }

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
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const cookieToken = req.cookies.deviceToken;

    if (!user.deviceToken) {
      const newToken = crypto.randomBytes(32).toString("hex");

      user.deviceToken = newToken;
      await user.save();

      res.cookie("deviceToken", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS,
      );

      return res.status(200).json({
        ...user._doc,
        token,
      });
    }

    if (cookieToken === user.deviceToken) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS,
      );

      return res.status(200).json({
        ...user._doc,
        token,
      });
    }

    return res.status(401).json("This account is registered on another device");
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    if (email === null && password === null) {
      return res.status(406).json({ msg: "Format not acceptable" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(406).json({ msg: "user already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
      role,
    });
    await newUser.save();
    res.status(201).json({ msg: "User created succefully", newUser });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.put("/user/:id", verifyAdmin, async (req, res) => {
  const userId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    {
      new: true,
    },
  );

  res.status(200).json("role access changed");
});

module.exports = router;
