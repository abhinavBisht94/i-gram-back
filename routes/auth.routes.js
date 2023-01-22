//---------------------------------------
//
const { Router } = require("express");
const createError = require("http-errors");

const UserSchema = require("../models/UserModel");

const authRouter = Router();

//---------------------------------------

authRouter.post("/signup", async (req, res) => {
  console.log("req.body:", req.body);

  // checking if the entered email is present in the database
  let { email } = req.body;
  if (!email) {
    res.status(500).send({ message: "Error occurred" });
  } else {
    let searchResult = await UserSchema.find({
      email: { $regex: email },
    });
    console.log("searchResult:", searchResult);

    if (searchResult.length === 0) {
      const user = await new UserSchema(req.body);

      user.save((err, success) => {
        if (err) {
          res.status(500).send({ message: "Error occurred" });
        }
        console.log("success:", success._id);
        return res.status(201).send({ message: "Sign up success" });
      });
    } else {
      res.status(500).send({ message: "Email already registered" });
    }
  }
});

authRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    res.status(500).send({ message: "Error occurred" });
  } else {
    let searchResult = await UserSchema.find({
      $and: [{ email: { $regex: email } }, { password: { $regex: password } }],
    });
    console.log("searchResult:", searchResult);

    if (searchResult.length === 0) {
      res.status(500).send({ message: "Email or password is wrong" });
    } else {
      let check = false;
      let send = "";

      searchResult.map((e) => {
        if (e.email === email && e.password === password) {
          check = true;
          send = e._id;
        }
      });

      console.log("check:", check);
      console.log("send:", send);

      if (!check) {
        res.status(500).send({ message: "Entered Email or password is wrong" });
      } else {
        return res.send([send]);
      }
    }
  }
});

//---------------------------------------
// Export
module.exports = authRouter;
