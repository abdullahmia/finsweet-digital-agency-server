const { createCategory, getAllCategories, deleteCategory, updateCategory, createProject, getProjects } = require('../controllers/projectController');
const uploader = require('../lib/multer');
const router = require('express').Router();

const { isLoggedIn, isAdmin } = require('../middlewares/auth');


// Category
router.route('/category')
    .post([isLoggedIn, isAdmin], createCategory)
    .get(getAllCategories)

router.route('/category/:id')
    .patch([isLoggedIn], updateCategory)
    .delete([isLoggedIn], deleteCategory)


router.post('/', isLoggedIn, isAdmin, uploader.array('images'), createProject)
router.get('/', getProjects);


module.exports = router;