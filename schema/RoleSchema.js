import mongoose, { Schema } from "mongoose";
import { ChildSchema } from "./ChildModuleSchema.js";
import { ParentSchema } from "./ParentModuleSchema.js";

const AccesManagementSchema = {
    ...ParentSchema,
    child : [ChildSchema]
}

const RoleSchema = new Schema({
    name : String,
    access_management : [AccesManagementSchema],
    users_list : [{type : Schema.Types.ObjectId, ref : "User"}]
})



export default mongoose.model("Roles" , RoleSchema)