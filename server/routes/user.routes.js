import express from 'express'
import { body } from 'express-validator'

import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'
import shopController from '../controllers/shop.controller'

const router = express.Router()

router.get('/api/users', userController.getUsers)

router.post('/api/users', 
        body('password', "Password must have at least 3 characteres")
        .isLength({ min: 3 })
, userController.createUser)

router.param('userId', userController.getUserById)

router.get('/api/users/:userId', authController.requireSignin, userController.getUser)

router.put('/api/users/:userId',
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.updateUser)

router.delete('/api/users/:userId', 
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.deleteUser)

router.put('/api/stripe_auth/:userId', 
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.stripeAuth,
        userController.updateUser)

router.post('/api/test_stripe/:userId/createCharge', 
        authController.requireSignin, 
        userController.createCharge)

// router.get('/api/stripe_customer/:userId', userController.stripeCustomer)
        

export default router