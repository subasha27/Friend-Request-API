const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./src/config/db");
const route = require("./src/router/userRouter");

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/api",route);

connectDB();

const port = process.env.PORT || 9000

app.listen(port,()=>{
    console.log(`Server is Running on Port : ${port}`)
})