const { createService, getServices, getService, updateService, deleteService } = require('../controllers/serviceController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();


router.route('/')
    .post([isLoggedIn, isAdmin], createService)
    .get(getServices)


router.route('/:id')
    .patch([isLoggedIn, isAdmin], updateService)
    .delete([isLoggedIn, isAdmin], deleteService)
    .get(getService)


module.exports = router;