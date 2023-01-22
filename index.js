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
const PORT = process.env.PORT || 3000;
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
Server;
app.listen(PORT, async () => {
  try {
    await connection;
  } catch {
    console.log("Something went wrong while connecting to db");
  }
  console.log(`listening on PORT ${PORT}`);
});

// &&&&&&&&&&&&&&&&&&&&&&&&&&

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URL);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("listening for requests");
//   });
// });

// &&&&&&&&&&&&&&&&&&&&&&&&&&

// const { MongoClient } = require("mongodb");
// const uri = process.env.MONGODB_URL;
// const client = new MongoClient(uri);
// client.connect((err) => {
//   if (err) {
//     console.error(err);
//     return false;
//   }
//   // connection to mongo is successful, listen for requests
//   app.listen(PORT, () => {
//     console.log("listening for requests");
//   });
// });

// &&&&&&&&&&&&&&&&&&&&&&&&&&

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = process.env.MONGODB_URL;

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object

//   // client.close();

//   app.listen(PORT, () => {
//     console.log("listening for requests");
//   });
// });
