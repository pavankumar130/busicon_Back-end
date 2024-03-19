const mongoose = require('mongoose')

// Define schema
const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  jobDescription: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobLocation: { type: String, required: true },
  jobRequired: { type: String, required: true },
})

// Create model from schema
const Job = mongoose.model('careers', jobSchema)
module.exports = Job
