//---------------------------------------
// Imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// require("dotenv").config();
const connection = require("./db");
const UserSchema = require("./models/UserModel");
const authRouter = require("./routes/auth.routes");
const jobRouter = require("./routes/job.routes");

//---------------------------------------
// Middleware
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
dotenv.config();

app.use("/auth", authRouter);
app.use("/jobs", jobRouter);

//---------------------------------------
app.get("/", async (req, res) => {
  console.log("Hello! this is expertia-app");

  console.log("req:", req.params);
  res.send("Hello! this is expertia-app");
});

app.get("/:token", async (req, res) => {
  // console.log("req2:", req.params);

  if (req.params) {
    let searchResult = await UserSchema.find({ __id: { $regex: req.params } });
    // console.log("searchResult:", searchResult);

    let sendEmail = "";
    searchResult.map((e) => {
      // console.log(e._id);
      if (e._id == req.params.token) {
        sendEmail = e.email;
        console.log(e.email);
        return res.send([sendEmail]);
      }
    });
  }
});

//---------------------------------------
// Server
app.listen(PORT, async () => {
  try {
    await connection;
  } catch {
    console.log("Something went wrong while connecting to db");
  }
  console.log(`listening on PORT ${PORT}`);
});
