const { addContact } = require('../controllers/contactController');

const router = require('express').Router();

router.route('/')
    .post(addContact)

module.exports = router;