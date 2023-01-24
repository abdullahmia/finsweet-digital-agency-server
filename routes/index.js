const router = require('express').Router();


router.use('/auth', require("./auth"));
router.use('/article', require('./article'));
router.use('/project', require('./project'));

module.exports = router;