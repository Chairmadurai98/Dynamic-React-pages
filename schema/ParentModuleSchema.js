import mongoose, { Schema } from "mongoose";


export const Access = {
    default : false,
    type : Boolean
}

export const ModuleAccess = {
    path : String,
    access : Access,
    show : Access,
}



export const ParentSchema = {
    name : String,
    slug : String,
    frontend_component :String,
    path : String,
    access : Access,
    show : Access,
    // list : ModuleAccess,
    view : ModuleAccess,
    edit : ModuleAccess,
    add : ModuleAccess,
    export : ModuleAccess,
}

const ParentModuleSchema = new Schema({
    ...ParentSchema,
    child_module : [{type : Schema.Types.ObjectId, ref : "ChildMoudle"}]
})

export default mongoose.model("ParentModule" , ParentModuleSchema)