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



//Variables
const app = express();
const {PORT, MONGO_URL} = process.env;




//middleware
app.use(cookieParser())
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))
app.use(cors())


//Routes
app.use("/api/users", userRouter)
app.use("/api/campus", campusRouter)
app.use("/api/building", buildingRouter)




//Database Connect
mongoose.connect(MONGO_URL)
    .then(()=>console.log("Server Connect"))
    .catch(err=>console.log(err))



//Server
app.listen(PORT, (err) => {
    !err ? console.log("Server Started in", PORT) : console.log(err);
})

