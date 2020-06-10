const express = require('express');
const chatRouter = express.Router();

/* localhost:3000 */
chatRouter.get('/', (req, res) => {
    res.send('server is up and running')
    
})

module.exports = chatRouter;
