const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();

router.post('/', (req, res) => {
    User.findOne({ id: req.body.id}) 
        .then(result => {
            if(result) {
                hasher({password : req.body.password, salt : result.salt}, (err, pass, salt, hash) => {
                    if(hash === result.password) {
                        req.session.user = {
                            "nickName" : result.nick_name,
                            "id" : req.body.id,
                        }
                        req.session.save()
                        
                        res.redirect("/lobby");                            //방 리스트 이동 
                    } else {
                        res.render("loginForm", {alert: 'fail'});         // 로그인 페이지(비번 틀림)
                    }        
                })
            } else {
                res.render("loginForm",{alert: 'fail'})                   //로그인 페이지(아이디 없음)
            }
        })
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.render("loginForm", {alert: 'logout' });
});

module.exports = router;