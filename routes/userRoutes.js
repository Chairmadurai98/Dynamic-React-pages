// Package
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Schema
import User from "../schema/Userschema.js";

// Const
const router = express.Router();

const validUser = async (req, res, next, err) => {
  const token = await req.header("auth");
  if (token) {
    res.status(200).json(token);
  } else {
    res.status(400).json("No");
  }
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password: reqPassword, username } = req.body;
    const userFound = await User.findOne({ email });
    userFound && res.status(400).json("User Already Register");
    const salt = bcrypt.genSaltSync(11);
    const hash = bcrypt.hashSync(reqPassword, salt);
    const newUser = new User({
      username,
      email,
      password: hash,
    });
    const userData = await newUser.save();
    const { password, ...others } = userData._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password: reqPassword } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const compare = bcrypt.compareSync(reqPassword, user.password);
      if (compare) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        const { password, ...others } = user._doc;
        return res.status(200).json({
          ...others,
          token,
        });
      } else {
        return res.status(400).json("Wrong passwaord");
      }
    } else {
      return res.status(400).json("Email Not Found");
    }
  } catch (err) {
    console.log(err, "err")
    return res.status(500).json(err);
  }
});

export default router;
