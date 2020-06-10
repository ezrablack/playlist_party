const router = require('express').Router()

const authCheck = (req,res,next) => {
    if(!req.user){
        res.redirect('/homepage')
    }else{
        next()
    }
}

router.get('/playground', authCheck, (req,res) =>{
    res.send(req.session.user)
    // res.send('you are logged in, ' + req.user.username)
})

module.exports = router 