import express from 'express'

import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'
import shopController from '../controllers/shop.controller'
import auctionController from '../controllers/auction.controller'

const router = express.Router()

router.param('userId', userController.getUserById)

router.param('auctionId', auctionController.getAuctionById)

router.post('/by/:userId', 
authController.requireSignin,
authController.hasAuthorization,
shopController.isSeller,
auctionController.createAuction
)

router.get('/', auctionController.getAllAuctions)

router.get('/image/:auctionId', auctionController.getAuctionImage)

router.get('/:auctionId', auctionController.getAuction)

export default router

