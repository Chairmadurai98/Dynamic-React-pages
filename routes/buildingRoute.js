import express from "express"
import Building from "../schema/BuildingSchema.js"
import Campus from "../schema/CampusSchema.js"
import { capitizileLetter } from "../utils/helper.js"


//Variables
const router = express.Router()

//Add Building
router.post("/add/:id", async (req, res) => {
    try {
        const campus = await Campus.findById(req.params.id)
        const nameExists = await Building.findOne({buildingName : req.body.buildingName})
        if (!campus || nameExists) {
            return res.status(404).json("Campus Id not Found or Duplicate Building Name")
        }
        else {
            
            const build = new Building({
                buildingName: req.body.buildingName,
                campusId: req.params.id
            })
            const savedData = await build.save()
            await Campus.findByIdAndUpdate(req.params.id, {
                $addToSet: { buildings: savedData._id }
            }, { new: true })
            return res.status(200).json("SuccessFully Building Added")

        }

    } catch (error) {
        return res.status(500).json(error)
    }
})

//Delete Buildings

router.delete("/delete/:id", async (req, res) => {
    try {

        const data = await Building.findById(req.params.id)
        const build = await Building.findByIdAndDelete(req.params.id)
        if (!build) {
            return res.status(404).json("Not Found")
        }
        else {
            const id = data.campusId
            const buid = data._id
            await Campus.findByIdAndUpdate(id, {
                $pull: { buildings: buid }
            }, { new: true })
            return res.status(200).json("SuccessFully Deleted Building")
        }


    } catch (error) {
        return res.status(500).json(error)
    }
})

router.get("/", async (req, res) => {
    const build = await Building.aggregate([{
        $lookup : {
            as : 'campusId',
            from : "campus",
            pipeline : [{
                $project : {
                    label : capitizileLetter('$name'),
                    place : capitizileLetter('$place'),
                    value : '$_id',
                }, 
            }]
        },
    },
    {
        $project : {
            buildingName : 1,
            status : 1,
            campusId : {
                $arrayElemAt : ['$campusId', 0]
            }
        }
    }
]).exec()
    if (build) return res.status(200).json(build)
    return res.status(400).json("Something Wrong")
})



router.put("/update/:id", async (req, res) => {
    try {
        const update = await Building.findByIdAndUpdate(req.params.id, { $set: { buildingName: req.body.buildingName, status: req.body.status } })
        if (update) {
            return res.status(200).json("Updated Sucessfully")
        } else {
            return res.status(404).json("Something Wrong")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

















export default router
