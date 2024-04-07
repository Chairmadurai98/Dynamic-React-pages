import express from "express";
const router = express.Router();
import Campus from "../schema/CampusSchema.js";
import Building from "../schema/BuildingSchema.js";
import { capitizileLetter } from "../utils/helper.js";

router.post("/add", async (req, res) => {
  const nameExists = await Campus.findOne({ name: req.body.name });
  if (nameExists) {
    return res.status(404).json("Duplicate campus Name");
  } else {
    try {
      const campusData = new Campus({
        name: req.body.name,
        status: req.body.status,
        place: req.body.place,
      });
      const savedData = await campusData.save();
      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
});

router.get("/", async (req, res, next) => {
  const campus = await Campus.aggregate([
    {
      $lookup: {
        as: "buildings",
        from: "buildings",
        pipeline: [
          {
            $project: {
              _id: 0,
              label: capitizileLetter("$buildingName"),
              value: "$_id",
            },
          },
        ],
      },
    },
    {
      $project: {
        name: capitizileLetter("$name"),
        place: capitizileLetter("$place"),
        buildings: 1,
      },
    },
  ]).exec();
  if (campus) return res.status(200).json(campus);
  return res.status(400).json("Something Wrong");
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const campusData = await Campus.findByIdAndDelete(req.params.id);
    if (!campusData) {
      return res.status(404).json("Campus Id Not Found");
    } else {
      const build = await Building.remove({
        campusId: { $in: req.params.id },
      });
      if (!build) {
        return res.status(200).json("SucessFully Deleted Only Campus");
      } else {
        return res.status(200).json("Campus and Building SucessFully Deleted");
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const update = await Campus.findByIdAndUpdate(req.params.id, {
      $set: { ...req.body },
    });
    if (update) {
      return res.status(200).json("Updated Sucessfully");
    } else {
      return res.status(404).json("Somethings Wrong");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
