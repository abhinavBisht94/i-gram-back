//---------------------------------------
//
const { Router } = require("express");
const createError = require("http-errors");

const UserSchema = require("../models/UserModel");
const JobModel = require("../models/JobModel");

const jobRouter = Router();

//---------------------------------------

//* CRUD Operations

//& Get all the job application of a user
jobRouter.get("/:userid", async (req, res) => {
  const expertiaUser = req.params.userid;
  //! "GET" all task based on userid
  let searchResult = await JobModel.find({
    userid: { $regex: expertiaUser },
  });

  let sendArr = [];
  searchResult.map((elem) => {
    if (elem.userId === expertiaUser) {
      sendArr = elem.jobsApplied;
    }
  });

  return res.status(201).send(sendArr);
});

//---------------------------------------

//& Updating the value in the jobsApplied
jobRouter.post("/:userid", async (req, res) => {
  const expertiaUser = req.params.userid;

  //! "GET" all task based on userid
  let searchResult = await JobModel.find({
    userid: { $regex: expertiaUser },
  });
  let userArr = {};
  searchResult.map((elem) => {
    if (elem.userId === expertiaUser) {
      userArr = elem;
    }
  });

  //! "UPDATE" that particular user's job application
  let appliedJobsId;
  let newJobsArr;
  if (userArr._id !== undefined) {
    appliedJobsId = userArr._id;

    newJobsArr = userArr.jobsApplied;
    newJobsArr.push(req.body.jobsApplied);

    let update = await JobModel.updateOne(
      { _id: [appliedJobsId] },
      { $set: { jobsApplied: newJobsArr } }
    );
  } else {
    let tempSend = {
      userId: expertiaUser,
      jobsApplied: [req.body.jobsApplied],
    };

    // let newInsert = await JobModel.insertOne(tempSend);

    const sendTask = await new JobModel(tempSend);
    sendTask.save((err, success) => {
      if (err) {
        res.status(500).send({ message: "Error occurred" });
      }
      console.log("success:", success);
    });

    return res.status(201).send([req.body.jobsApplied]);
  }

  //! "GET" all task based on userid
  let sendArr = [];
  searchResult = await JobModel.find({
    userid: { $regex: expertiaUser },
  });

  searchResult.map((elem) => {
    if (elem.userId === expertiaUser) {
      sendArr = elem.jobsApplied;
    }
  });

  return res.status(201).send(sendArr);
});

async function basicGet() {
  //! "GET" all task based on userid
  let sendArr = [];
  searchResult = await JobModel.find({
    userid: { $regex: expertiaUser },
  }).then(() => {
    searchResult.map((elem) => {
      if (elem.userId === expertiaUser) {
        sendArr = elem.jobsApplied;
      }
    });

    return res.status(201).send(sendArr);
  });
}

//---------------------------------------

//& delete a Job Application
jobRouter.delete("/:userid/:job", async (req, res) => {
  const expertiaUser = req.params.userid;
  const jobRemove = req.params.job;

  //! "GET" all task based on userid
  let searchResult = await JobModel.find({
    userid: { $regex: expertiaUser },
  });
  let userArr = {};
  searchResult.map((elem) => {
    if (elem.userId === expertiaUser) {
      userArr = elem;
    }
  });

  let jobsArr = userArr.jobsApplied;
  for (let i = 0; i < jobsArr.length; i++) {
    if (jobsArr[i] === jobRemove) jobsArr.splice(i, 1);
  }

  //! "UPDATE" jobs array
  let appliedJobsId = userArr._id;
  let update = await JobModel.updateOne(
    { _id: [appliedJobsId] },
    { $set: { jobsApplied: jobsArr } }
  );

  //! "GET" all task based on userid
  searchResult = await JobModel.find({
    userid: { $regex: expertiaUser },
  });

  let sendArr = [];
  searchResult.map((elem) => {
    if (elem.userId === expertiaUser) {
      sendArr = elem.jobsApplied;
    }
  });

  return res.status(201).send(sendArr);
});

//---------------------------------------

// Export
module.exports = jobRouter;
