import { assignIn } from 'lodash'
import crypto from 'crypto'
import { validationResult } from 'express-validator'
import request from 'request'
import stripe from 'stripe'

import User from '../models/user.model'
import { Order } from '../models/order.model'
import Profile from '../models/profile.model'
import errorHandler from '../helpers/dbErrorHandler'
import Product from '../models/product.model'

const myStripe = stripe(process.env.REACT_APP_STRIPE_TEST_PRIVATE_KEY)

const createUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg
        return res.status(400).json({
            error: errorMsg
        })
    }

    const { name, email } = req.body

    const user = new User({ name, email })
    try {
        await user.save()

        const salt = Math.round((new Date().valueOf()) * Math.random()) + ""

        const password = await crypto.createHmac('sha256', salt).update(req.body.password).digest('hex')

        const profile = new Profile({
            user: user,
            password: password,
            salt: salt,
        })

        await profile.save()

        return res.status(200).json({
            message: 'Registered successfully.'
        })
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, 'name email createdAt, updatedAt').exec()
        return res.status(200).json(users)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getUserById = async (req, res, next, userId) => {
    try {
        const user = await User.findById(userId).exec()
        if (!user) {
            return res.status(400).json({
                message: 'User not found.'
            })
        } 
        req.profile = user
        next()
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const updateUser = async (req, res) => {
    try {
        let user = req.profile
        user = assignIn(user, req.body)
        user.updatedAt = Date.now()
        await user.save()
        return res.json(user)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = req.profile
        const profile = await Profile.findOne({ user: user })
        const deletedUser = await user.remove()
        const deleteProfile = await profile.remove()
        deleteProfile.hashed_password = undefined
        deleteProfile.salt = undefined
        return res.json(deletedUser)
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const stripeAuth = (req, res, next) => {
    try {
        request({
            url: 'https://connect.stripe.com/oauth/token',
            method: 'POST',
            json: true,
            body: {
                client_secret: process.env.REACT_APP_STRIPE_TEST_PRIVATE_KEY,
                code: req.body.stripe,
                grant_type: 'authorization_code'
            },   
        }, (error, response, body) => {
            if (body.error) {
                return res.status(400).json({
                    error: body.error_description
                })
            } 
            req.body.stripe_seller = body
            req.body.stripe_seller.access_token = ''
            next()
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const stripeCustomer = async (req, res, next) => {
    try {
        let stripe_customer = req.profile.stripe_customer
        if (!stripe_customer) {
            const customer = await myStripe.customers.create({
                email: req.profile.email,
            })
            await User.update({ '_id': req.profile._id }, { $set: { stripe_customer: customer.id }},
                    (err, order) => {
                        if (err) {
                            console.log('from stripe_customer', err)
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err)
                            })
                        }
            })
            stripe_customer = customer.id
        }
        const order = await Order.findById(req.order._id).exec()
        order.payment_id = stripe_customer
        req.order = order
        await order.save()
        next()
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getTotal = async (products) => {
    const total = await products.reduce(async (prev, curr) => {
        const product = await Product.findById(curr.product._id).exec()
        return prev + product.price * Number(curr.quantity)
    }, 0)

    return parseFloat(total).toFixed(2)
}

const createCharge = async (req, res, next) => {
    try {
        const total = await getTotal(req.order.products)
        const paymentIntent = await myStripe.paymentIntents.create({
            customer: req.order.paymentId,
            setup_future_usage: 'off_session',
            amount: parseInt(total) * 100,
            currency: 'usd',
            payment_method_types: ['card'],
        })
        return res.status(200).json({ paymentIntent: paymentIntent, orderId: req.order._id })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default { getUsers, createUser, getUserById, getUser, 
    updateUser, deleteUser, stripeAuth, stripeCustomer,
    createCharge, 
}