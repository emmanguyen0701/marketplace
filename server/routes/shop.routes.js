import express from 'express'

import shopController from '../controllers/shop.controller'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'

const router = express.Router()

router.param('userId', userController.getUserById)

router.param('shopId', shopController.getShopById)

router.get('/api/shops/:shopId', shopController.getShop)

router.post('/api/shops/by/:userId', 
    authController.requireSignin,
    authController.hasAuthorization,
    shopController.isSeller, shopController.createShop)

router.get('/api/shops/by/:userId', 
    authController.requireSignin,
    authController.hasAuthorization,
    shopController.isSeller, shopController.getShopList)

router.get('/api/shops/logo/:shopId', shopController.getLogo)

router.get('/api/shops', shopController.listShops)

router.put('/api/shops/:shopId',
    authController.requireSignin,
    shopController.isOwner,
    shopController.updateShop)

router.delete('/api/shops/:shopId',
    authController.requireSignin,
    shopController.isOwner,
    shopController.removeShop)

export default router



