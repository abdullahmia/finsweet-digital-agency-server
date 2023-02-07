const { addContact, getContacts } = require('../controllers/contactController');

const router = require('express').Router();

const { isAdmin, isLoggedIn } = require('../middlewares/auth');

router.route('/')
    .post(addContact)
    .get([isLoggedIn, isAdmin], getContacts)

module.exports = router;