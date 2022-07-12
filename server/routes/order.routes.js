import express from 'express'

import orderController from '../controllers/order.controller'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'
import productController from '../controllers/product.controller'
import shopController from '../controllers/shop.controller'

const router = express.Router()

router.get('/api/order/status_values', 
    orderController.getStatusValues)

router.get('/api/orders/:orderId', orderController.getOrderById)

router.get('/api/orders/shop/:shopId', 
    authController.requireSignin,
    shopController.isOwner,
    orderController.getOrdersByShop)

router.post('/api/order/:shopId/createCharge/:userId',
    authController.requireSignin,
    orderController.createOrder,
    userController.stripeCustomer,
    productController.decreaseStockQuantity,
    userController.createCharge)

router.put('/api/order/:shopId/cancel/:orderId', 
    authController.requireSignin,
    shopController.isOwner,
    orderController.cancelOrder,
    productController.increaseStockQuantity)

router.put('/api/order/:shopId/status', 
    authController.requireSignin,
    shopController.isOwner,
    orderController.updateStatus)

router.get('/api/orders/user/:userId',
    authController.requireSignin,
    orderController.getOrdersByUser)

router.param('userId', userController.getUserById)

router.param('shopId', shopController.getShopById)

export default router

