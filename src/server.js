// Imports
const express = require('express')
const path = require('path');
const morgan = require('morgan');

// Routes
const router = require('./routes')

// Environment
require('dotenv').config()

// App
const app = express()

// App config
app.use(express.json({ limit: '50mb' }))
app.use(morgan('dev'));

// Prefixed routes
app.use(`/${process.env.APP_VERSION}`, router)
app.use('/v1/uploads', express.static(path.join(__dirname, 'uploads')));

// PORT
app.listen(process.env.PORT)

// Start message
console.log(` VERSION      : ${process.env.APP_VERSION}`)
console.log(` PORT         : ${process.env.PORT}`)
