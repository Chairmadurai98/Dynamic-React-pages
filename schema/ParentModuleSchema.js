import mongoose, { Schema } from "mongoose";

const ParentModuleSchema = new Schema({
    name : {
        access : Boolean
    },
    slug : {
        access : Boolean
    },
    child_module : [{type : Schema.Types.ObjectId, ref : "ChildMoudle"}]
})



export default mongoose.model("ParentModule" , ParentModuleSchema)