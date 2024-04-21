import express from "express";
import { capitizileLetter } from "../utils/helper.js";
import ParentModuleSchema from "../schema/ParentModuleSchema.js";

const EssentialRouter = express.Router()


EssentialRouter.get("/", async (req, res) => {
    const { includes } = req.query
    if(includes === 'modules') {
        const moduleLists = await ParentModuleSchema.aggregate([
            {
              $lookup: {
                as: "child_module",
                from: "childmodules",
                pipeline: [
                  
                ],
              },
            },
          ]).exec();
        if (moduleLists) return res.status(200).json(moduleLists);
    }
    
  return res.status(400).json("Something Wrong");
});



export default EssentialRouter;
