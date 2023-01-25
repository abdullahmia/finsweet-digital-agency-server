const router = require('express').Router();


router.use('/auth', require("./auth"));
router.use('/article', require('./article'));
router.use('/project', require('./project'));
router.use('/contact', require('./contact'));
router.use('/service', require('./service'));

module.exports = router;