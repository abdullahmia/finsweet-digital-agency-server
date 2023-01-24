const { createCategory, getAllCategories, deleteCategory, updateCategory, createArticle, getArtilces, deleteArticle, getArticle, updateArticle } = require('../controllers/articleController');
const uploader = require('../lib/multer');
const router = require('express').Router();

const { isLoggedIn, isAdmin } = require('../middlewares/auth');


// Category
router.route('/category')
    .post([isLoggedIn, isAdmin], createCategory)
    .get(getAllCategories)

router.route('/category/:slug')
    .patch([isLoggedIn], updateCategory)
    .delete([isLoggedIn], deleteCategory)


// article
router.route('/')
    .post([isLoggedIn, isAdmin], uploader.single('image'), createArticle)
    .get(getArtilces)



router.route('/:slug')
    .delete([isLoggedIn, isAdmin], deleteArticle)
    .get(getArticle)

router.patch("/:id", [isLoggedIn, isAdmin], uploader.single("image"), updateArticle);


module.exports = router;