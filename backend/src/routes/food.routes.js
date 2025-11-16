const express = require('express')
const router = express.Router()
const foodControlller = require('../controllers/food.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
})

/* POST -> /api/food/ [protected route] */
router.post('/', authMiddleware.authFoodPartnerMiddleware,upload.single("video"),foodControlller.createFood)

/* GET -> /api/food/ [protected route] for normal users */
router.get('/',authMiddleware.authUserMiddleware,foodControlller.getFoodItems)

router.post('/like', authMiddleware.authUserMiddleware,foodControlller.likeFood)

router.post('/save',authMiddleware.authUserMiddleware,foodControlller.saveFood)

router.get('/save',authMiddleware.authUserMiddleware,foodControlller.getSavedFood)


module.exports = router