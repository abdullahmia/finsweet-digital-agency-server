const router = require('express').Router();


router.use('/auth', require("./auth"));
router.use('/article', require('./article'));

module.exports = router;