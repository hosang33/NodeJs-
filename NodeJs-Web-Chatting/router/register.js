const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();


router.get('/', (req, res) => {
    res.render("register");
});

//회원가입 
router.post('/', (req, res) => {
    if(req.body.id == '' || req.body.nickName == '' || req.body.password == ''){
        res.render("register",{alert: 'emptyForm'});
        return 
    }
    console.log(req.body)
    User.findOne({ id: req.body.id})
        .then( result => {
            if (result) {
                res.render("register",{alert: 'IdDuplicate'});
            } else {
                hasher({password : req.body.password}, (err, pass, salt, hash) => {
                    const newUser = new User({
                        nick_name : req.body.nickName,
                        id : req.body.id,
                        password : hash,
                        salt : salt 
                    });
                    newUser.save();
                })
                res.render("loginForm",{alert: 'registerSuccess'});
            }
        })
    
});


module.exports = router;
