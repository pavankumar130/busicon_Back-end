const express = require('express')
const app = express()
const port = 3001
var uniqid = require('uniqid')

const cors = require('cors')
app.use(cors())

const database = require('./database')
const schema = require('./schema')
const Job = require('./schema')

database.on('error', console.error.bind(console, 'MongoDB connection error:'))
database.once('open', () => {
  console.log('Connected to MongoDB')
})

app.get('/alljobs', async (req, res) => {
  try {
    const response = await schema.find()
    res.json(response)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/job/:id', async (req, res) => {
  try {
    const jobId = req.params.id
    const response = await schema.findOne({ jobId: jobId })

    if (!response) {
      return res.status(404).json({ error: 'Job not found' })
    }
    res.json(response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.post('/addjob', async (req, res) => {
  try {
    const formData = {
      jobId: uniqid(),
      jobDescription: req.headers.jobdescription,
      jobTitle: req.headers.jobtitle,
      jobLocation: req.headers.joblocation,
      jobRequired: req.headers.jobrequired,
    }

    const job = await schema.create(formData)
    res.status(201).json({ message: 'Job created successfully', job })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/deletejob/:id', async (req, res) => {
  try {
    const jobId = req.params.id
    const deleted = await schema.deleteOne({ jobId: jobId })
    if (deleted.deletedCount === 1) {
      res.status(200).json({ message: 'Job deleted successfully' })
    } else {
      res.status(404).json({ error: 'Job not found' })
    }
  } catch (error) {
    console.log('Failed to delete job ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
