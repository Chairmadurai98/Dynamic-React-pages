
import mongoose from "mongoose";

const BuildingSchema = new mongoose.Schema({
  buildingName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: Boolean,
    default : true
  },
  campusId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref : "Campus"
  }
},
{
  timestamps: true
}

)



export default mongoose.model("Building", BuildingSchema)