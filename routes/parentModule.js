import express from "express";
import Building from "../schema/BuildingSchema.js";
import Campus from "../schema/CampusSchema.js";
import { capitizileLetter } from "../utils/helper.js";
import ParentModuleSchema from "../schema/ParentModuleSchema.js";
import slugify from "slugify";
//Variables
const ParentModuleRouter = express.Router();

//Add Role
ParentModuleRouter.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, {
      lower : true
    }).toLowerCase()
    const generateWithId = [ 'view', 'edit', ]
    const generateWithOutId = [ 'add', 'export']
    const obj = {
      ...req.body,
      slug : slug,
      frontend_component : slug,
    }


    generateWithId.forEach((id)=>{
      obj[id] = {
        ...obj[id],
        path : `/${slug}/${id}/:id`,
      }
    })
    generateWithOutId.forEach((id)=>{
      obj[id] = {
        ...obj[id],
        path : `/${slug}/${id}`,
      }
    })

    const modules = ParentModuleSchema(obj)
    const data = await modules.save()

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Delete Buildings
ParentModuleRouter.delete("/delete/:id", async (req, res) => {
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

ParentModuleRouter.get("/", async (req, res) => {
  const moduleLists = await ParentModuleSchema.aggregate([
    {
      $lookup: {
        as: "child_module",
        from: "childmodules",
        pipeline: [
          {
            $project: {
              label: "$name",
              value: "$_id",
            },
          },
        ],
      },
    },
    {
      $project: {
        name: 1,
        child_module: 1,
      },
    },
  ]).exec();
  if (moduleLists) return res.status(200).json(moduleLists);
  return res.status(400).json("Something Wrong");
});

ParentModuleRouter.put("/update/:id", async (req, res) => {
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

export default ParentModuleRouter;
