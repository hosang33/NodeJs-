const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('loginForm');
});


module.exports = router;