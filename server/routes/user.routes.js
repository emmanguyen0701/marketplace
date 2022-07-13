import express from 'express'
import { body } from 'express-validator'

import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'

const router = express.Router()

router.get('/', userController.getUsers)

router.post('/', 
        body('password', "Password must have at least 3 characteres")
        .isLength({ min: 3 })
, userController.createUser)

router.param('userId', userController.getUserById)

router.get('/:userId', authController.requireSignin, userController.getUser)

router.put('/:userId',
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.updateUser)

router.delete('/:userId', 
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.deleteUser)

router.put('/stripe_auth/:userId', 
        authController.requireSignin, 
        authController.hasAuthorization, 
        userController.stripeAuth,
        userController.updateUser)

router.post('/test_stripe/:userId/createCharge', 
        authController.requireSignin, 
        userController.createCharge)
        

export default router