const mongoose = require("mongoose");

const appliedJobsSchema = mongoose.Schema({
  userId: { type: String, require: true },
  jobsApplied: { type: Array, require: true },
});

const JobModel = mongoose.model("appliedJob", appliedJobsSchema);

module.exports = JobModel;



// "userId": "6329ce4d272dc9d80182db1a",
//   "jobsApplied": [
//     "Backend Developer",
//     "Accountant"
//   ]