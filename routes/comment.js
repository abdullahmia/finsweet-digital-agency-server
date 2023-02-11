const { createComment, getComments } = require('../controllers/commentController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();

router.route("/")
    .post(createComment)
    .get([isLoggedIn, isAdmin], getComments);

module.exports = router;