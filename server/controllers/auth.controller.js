import jwt from 'jsonwebtoken'
import expressjwt from 'express-jwt'
import { validationResult } from 'express-validator'
import fetch from 'node-fetch'

import config from '../../config/config'
import User from '../models/user.model'
import Profile from '../models/profile.model'

const signin = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg
        return res.status(400).json({
            error: errorMsg
        })
    }

    try {
        const user = await User.findOne({ email: req.body.email }).exec()
        if (!user) {
            return res.status(401).json({
                error: 'User not found.'
            })
        }

        const profile = await Profile.findOne({ user: user }).exec()
        if (!profile) {
            return res.status(401).json({
                error: "Couldn't find the profile"
            })
        }

        if (!profile.authenticate(req.body.password)) {
            return res.status(401).json({
                error: "Email and password don't match."
            })
        }
        
        // create a signature
        const token = await jwt.sign({ _id: user._id }, config.jwtSecret) 

        res.cookie('t', token , { httpOnly: true })

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                seller: user.seller,
            }
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: "Something went wrong."
        })
    }
}

const signout = (req, res) => {
    try {
        res.clearCookie('t')
        return res.status(200).json({ message: 'Successfully sign out.' })
    } catch(err) {
        console.log(err)
    }
}

// function to decode the token (cookie) attached to Authorization header
const requireSignin = expressjwt({
    secret: config.jwtSecret,
    algorithms: ['HS256'],
    requestProperty: 'auth', //decoded value is attached to req.auth
})

const hasAuthorization = (req, res, next) => {
    if (!req.profile || !req.auth || req.profile._id.toString() !== req.auth._id) {
        return res.status(403).json({
            error: 'No authorization.'
        })
    }
    next()
}

export default { signin, signout, requireSignin, hasAuthorization }