const router = require('express').Router();


router.use('/auth', require("./auth"));
router.use('/article', require('./article'));
router.use('/project', require('./project'));
router.use('/contact', require('./contact'));
router.use('/service', require('./service'));
router.use('/make-payment', require('./payment'));
router.use('/order', require('./order'));
router.use('/notification', require('./notification'));

module.exports = router;