// Imports
const express = require('express')

// Routes
const router = require('./routes')

// Environment
require('dotenv').config()

// App
const app = express()

// App config
app.use(express.json({ limit: '50mb' }))

// Prefixed routes
app.use(`/${process.env.APP_VERSION}`, router)

// PORT
app.listen(process.env.PORT)

// Start message
console.log(` VERSION      : ${process.env.APP_VERSION}`)
console.log(` PORT         : ${process.env.PORT}`)
