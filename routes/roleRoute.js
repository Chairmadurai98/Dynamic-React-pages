import express from "express";
import Building from "../schema/BuildingSchema.js";
import Campus from "../schema/CampusSchema.js";
import { capitizileLetter } from "../utils/helper.js";
import RoleSchema from "../schema/RoleSchema.js";
import ParentModuleSchema from "../schema/ParentModuleSchema.js";
//Variables
const RoleRouter = express.Router();

//Add Role
RoleRouter.post("/add", async (req, res) => {
  try {
    const { name, access_management } = req.body;
   
    const modules = RoleSchema({
        name,
        access_management,
    })
    const data = await modules.save()

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Delete Buildings
RoleRouter.delete("/delete/:id", async (req, res) => {
  try {
    const data = await Building.findById(req.params.id);
    const build = await Building.findByIdAndDelete(req.params.id);
    if (!build) {
      return res.status(404).json("Not Found");
    } else {
      const id = data.campusId;
      const buid = data._id;
      await Campus.findByIdAndUpdate(
        id,
        {
          $pull: { buildings: buid },
        },
        { new: true }
      );
      return res.status(200).json("SuccessFully Deleted Building");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

RoleRouter.get("/", async (req, res) => {
  const moduleLists = await RoleSchema.find()
  if (moduleLists) return res.status(200).json(moduleLists);
  return res.status(400).json("Something Wrong");
});

RoleRouter.put("/update/:id", async (req, res) => {
  try {
    const update = await Building.findByIdAndUpdate(req.params.id, {
      $set: { buildingName: req.body.buildingName, status: req.body.status },
    });
    if (update) {
      return res.status(200).json("Updated Sucessfully");
    } else {
      return res.status(404).json("Something Wrong");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default RoleRouter;
