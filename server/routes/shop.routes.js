import express from 'express'

import shopController from '../controllers/shop.controller'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'

const router = express.Router()

router.param('userId', userController.getUserById)

router.param('shopId', shopController.getShopById)

router.get('/:shopId', shopController.getShop)

router.post('/by/:userId', 
    authController.requireSignin,
    authController.hasAuthorization,
    shopController.isSeller, shopController.createShop)

router.get('/by/:userId', 
    authController.requireSignin,
    authController.hasAuthorization,
    shopController.isSeller, shopController.getShopList)

router.get('/logo/:shopId', shopController.getLogo)

router.get('/', shopController.listShops)

router.put('/:shopId',
    authController.requireSignin,
    shopController.isOwner,
    shopController.updateShop)

router.delete('/:shopId',
    authController.requireSignin,
    shopController.isOwner,
    shopController.removeShop)

export default router



