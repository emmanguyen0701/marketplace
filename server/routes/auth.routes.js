import express from 'express'
import { body } from 'express-validator'

import authController from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signin', 
        body('password', 'Password is invalid').isLength({ min: 3 })
, authController.signin)

router.get('/signout', authController.signout)


export default router