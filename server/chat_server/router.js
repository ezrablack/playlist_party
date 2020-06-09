const express = require('express');
const chatRouter = express.Router();

/* GET homepage */
chatRouter.get('/', (req, res) => {
    res.send('server is up and running')
    
})

module.exports = chatRouter;
