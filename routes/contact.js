const { addContact, getContacts, deleteContact } = require('../controllers/contactController');

const router = require('express').Router();

const { isAdmin, isLoggedIn } = require('../middlewares/auth');

router.route('/')
    .post(addContact)
    .get([isLoggedIn, isAdmin], getContacts)


router.route('/:id')
    .delete([isLoggedIn, isAdmin], deleteContact)

module.exports = router;