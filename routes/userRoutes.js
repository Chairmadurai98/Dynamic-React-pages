// Package
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Schema
import User from "../schema/Userschema.js";
import RoleSchema from "../schema/RoleSchema.js";
import Userschema from "../schema/Userschema.js";

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
    const role_id = "6624a400f0b662e620607949";
    const newUser = new User({
      username,
      email,
      password: hash,
      role_id,
    });
    const userData = await newUser.save();
    const { password, ...others } = userData._doc;
    const role = await RoleSchema.findByIdAndUpdate(
      role_id,
      {
        $push: {
          users_list: others._id,
        },
      },
      { new: true }
    ).exec();
    res.status(200).json({ ...others, role });
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
    console.log(err, "err");
    return res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const users = await Userschema.aggregate([
    {
      $lookup: {
        as: "role_id",
        from: "roles",
        pipeline: [
          {
            $project: {
              access_management: {
                show: 0,
                "view.show": 0,
                "edit.show": 0,
                "add.show": 0,
                "export.show": 0,
                "export.path": 0,
              },
            },
          },
        ],
      },
    },
    {
      $project : {
        password : 0,
      }
    }
  ]);

  if (users) return res.status(200).json(users);
  return res.status(400).json("Something Wrong");
});

export default router;
