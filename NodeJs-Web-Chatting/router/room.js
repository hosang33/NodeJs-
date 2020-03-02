const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render("chatRoom",{user:req.session.user, roomId : req.query.roomId});
});

router.get('/create', (req, res) => {
    res.render("roomCreateForm", {user: req.session.user});
});
module.exports = router;