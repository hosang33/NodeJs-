const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();

router.post('/', (req, res) => {
    loginCheck()
    
    async function loginCheck() {
        var findUser = await User.findOne({id: req.body.id});
    
        if(findUser) {
           pwdSameCheck(req.body.password, findUser.password, findUser.salt, res);
           createUserSession(req, findUser.nick_name, req.body.id);
        } else {
            res.render("loginForm", {alert: 'fail'})
        }
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.render("loginForm", {alert: 'logout' });
});




function pwdSameCheck(pwd,findPwd,salt,res) {
    hasher({password : pwd, salt : salt}, (err, pass, salt, hash) => {
        if(hash === findPwd) {
            res.redirect("/lobby");      
            return                      
        } 
        res.render("loginForm", {alert: 'fail'});            
    })
}

function createUserSession(req,nickName,id) {
    req.session.user = {
        "nickName" : nickName,
        "id" : id,
    }
    req.session.save()
}
module.exports = router;