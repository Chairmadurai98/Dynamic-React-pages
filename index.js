//Import
import express from "express"
import mongoose from "mongoose";
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js"
import campusRouter from "./routes/campusRoute.js"
import buildingRouter from "./routes/buildingRoute.js";
import ParentModuleRouter from "./routes/parentModule.js";
import ChildModuleRouter from "./routes/childModule.js";
import RoleRouter from "./routes/roleRoute.js";
import EssentialRouter from "./routes/essentialRoute.js";



//Variables
const app = express();
const {PORT, MONGO_URL} = process.env;
const path = '/api'




//middleware
app.use(cookieParser())
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))
app.use(cors())


//Routes
app.use(`${path}/users`, userRouter)
app.use(`${path}/campus`, campusRouter)
app.use(`${path}/building`, buildingRouter)
app.use(`${path}/parent-module`, ParentModuleRouter)
app.use(`${path}/child-module`, ChildModuleRouter)
app.use(`${path}/role`, RoleRouter)
app.use(`${path}/essential`, EssentialRouter)








//Database Connect
mongoose.connect(MONGO_URL)
    .then(()=>console.log("Server Connect"))
    .catch(err=>console.log(err))



//Server
app.listen(PORT, (err) => {
    !err ? console.log("Server Started in", PORT) : console.log(err);
})

