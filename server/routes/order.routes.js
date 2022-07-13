import express from 'express'

import orderController from '../controllers/order.controller'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'
import productController from '../controllers/product.controller'
import shopController from '../controllers/shop.controller'

const router = express.Router()

router.get('/status_values', 
    orderController.getStatusValues)

router.get('/:orderId', orderController.getOrderById)

router.get('/shop/:shopId', 
    authController.requireSignin,
    shopController.isOwner,
    orderController.getOrdersByShop)

router.post('/:shopId/createCharge/:userId',
    authController.requireSignin,
    orderController.createOrder,
    userController.stripeCustomer,
    productController.decreaseStockQuantity,
    userController.createCharge)

router.put('/:shopId/cancel/:orderId', 
    authController.requireSignin,
    shopController.isOwner,
    orderController.cancelOrder,
    productController.increaseStockQuantity)

router.put('/:shopId/status', 
    authController.requireSignin,
    shopController.isOwner,
    orderController.updateStatus)

router.get('/user/:userId',
    authController.requireSignin,
    orderController.getOrdersByUser)

router.param('userId', userController.getUserById)

router.param('shopId', shopController.getShopById)

export default router

