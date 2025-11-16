const express = require('express')
const authMiddlewares = require('../middlewares/auth.middleware')
const foodPartnerController = require('../controllers/food-partner.controller')

const router = express.Router()

/* GET -> /api/food/:id  */
router.get("/:id",authMiddlewares.authUserMiddleware,foodPartnerController.getFoodPartnerById)

module.exports = router