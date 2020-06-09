'use strict'
const express = require('express');
const cors = require('cors');
const spotifyRouter = require('./router')

const app = express();

//spotify API router
app.use(cors())
app.use('/', spotifyRouter)


module.exports = app