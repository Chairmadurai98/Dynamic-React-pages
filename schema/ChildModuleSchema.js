import mongoose, { Schema } from "mongoose";
import { Access, ModuleAccess } from "./ParentModuleSchema.js";

export const ChildSchema = {
  name: String,
  slug: String,
  frontend_component: String,
  path: String,
  access: Access,
  show: Access,
  view: ModuleAccess,
  edit: ModuleAccess,
  add: ModuleAccess,
  export: ModuleAccess,
};

const ChildModuleSchema = new Schema({
  ...ChildSchema,
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: "ParentMoudle",
  },
});

export default mongoose.model("ChildModule", ChildModuleSchema);
