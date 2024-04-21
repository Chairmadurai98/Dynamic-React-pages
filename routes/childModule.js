import express from "express"
import Building from "../schema/BuildingSchema.js"
import Campus from "../schema/CampusSchema.js"
import { capitizileLetter } from "../utils/helper.js"
import slugify from "slugify"
import ChildModuleSchema from "../schema/ChildModuleSchema.js"
import ParentModuleSchema from "../schema/ParentModuleSchema.js"


//Variables
const ChildModuleRouter = express.Router()

//Add Role
ChildModuleRouter.post("/add", async (req, res) => {
    try {
      const { name, parend_id } = req.body;
      const slug = slugify(name, {
        lower : true
      }).toLowerCase()
      const generateWithId = [ 'view', 'edit']
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
  
      const modules = ChildModuleSchema(obj)
      const data = await modules.save()
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  
  //Delete Buildings
  ChildModuleRouter.delete("/delete/:id", async (req, res) => {
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
  
  ChildModuleRouter.get("/", async (req, res) => {

    const moduleLists = await ChildModuleSchema.aggregate([
      {
        $lookup: {
          as: "parent_id",
          from: "parentmodules",
          pipeline: [
            {
              $project: {
                label: capitizileLetter("$name"),
                 value : "$_id"
              },
            },
          ],
        },
      },
      // {
      //   $project: {
      //     name: 1,
      //     parent_moudule: 1,
      //   },
      // },
    ]).exec();
    if (moduleLists) return res.status(200).json(moduleLists);
    return res.status(400).json("Something Wrong");
  });
  
  ChildModuleRouter.put("/update/:id", async (req, res) => {
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

export default ChildModuleRouter
