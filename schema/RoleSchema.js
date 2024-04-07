import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema({
    list : {
        access : Boolean
    },
    add : {
        access : Boolean
    },
    edit : {
        access : Boolean
    },
    view : {
        access : Boolean
    },
    delete : {
        access : Boolean,
    },
    all : {
        access :Boolean
    },
    users_list : [{type : Schema.Types.ObjectId, ref : "User"}]
})



export default mongoose.model("Roles" , RoleSchema)