import formidable from "formidable"
import fs from 'fs'
import { assignIn } from 'lodash'

import dbErrorHandler from "../helpers/dbErrorHandler"

import Shop from '../models/shop.model'
import User from '../models/user.model'

export const isSeller = (req, res, next) => {
    if (!req.profile.seller) {
        return res.status(401).json({
            error: "You're not a seller"
        })
    }
    next()
}

export const getShopById = async (req, res, next, shopId) => {
    try {
        const shop = await Shop.findById(shopId)
                            .populate('owner', '_id email')
                            .exec()
        if (!shop) {
            return res.status(400).json({
                error: "Coundn't find shop."
            })
        }
        req.shop = shop
        next()
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getShop = (req, res) => {
    req.shop.logo = undefined
    return res.json(req.shop)
}

export const createShop = (req, res, next) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Logo couldn't be uploaded."
            })
        } 
        let shop = new Shop(fields)
        shop.owner = req.profile
        if (files.logo) {
            shop.logo.data = fs.readFileSync(files.logo.filepath)
            shop.logo.contentType = files.logo.mimetype
        }
        try {
            await shop.save()
            return res.status(200).json({
                message: 'Shop created successfully.'
            })
        } catch(err) {
            console.log("From backend", dbErrorHandler.getErrorMessage(err))
            return res.status(500).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
        }
    })
}

export const listShops = async (req, res) => {
    try {
        const shops = await Shop.find({}).exec()

        return res.status(200).json(shops)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getLogo = async (req ,res) => {
    try {
        const shopId = req.params.shopId
        const shop = await Shop.findOne({ _id: shopId }).exec()
        if (!shop) {
            return res.status(400).json({
                error: "Couldn't find shop"
            })
        } 
        res.set('Content-Type', shop.logo.contentType)
        return res.status(200).send(shop.logo.data)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getShopList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId }).exec()
        if (!user) {
            return res.status(400).json({
                error: "You're not logged in."
            })
        }
        const shops = await Shop.find({ owner: user })
                                .populate('owner', '_id email')
                                .exec()
        if (!shops) {
            return res.status(400).json({
                error: "No shops are found."
            })
        }
        return res.json(shops)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const isOwner = (req, res, next) => {
    const owner = req.auth && req.shop && req.shop.owner._id.toString() === req.auth._id.toString()
    if (!owner) {
        return res.status(403).json({
            error: "User is not authorized."
        })
    }
    next()
}

export const updateShop = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Logo could not be uploaded.'
            })
        }
        let shop = req.shop
        shop = assignIn(shop, fields)
        shop.updatedAt = Date.now()
        if (files.logo) {
            shop.logo.data = fs.readFileSync(files.logo.filepath)
            shop.logo.contentType = files.logo.mimetype
        }
        try {
            await shop.save()
            return res.status(200).json({
                message: "Shop updated."
            })
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
        }
    })
}

export const removeShop = async (req, res) => {
    try {
        const shopId = req.params.shopId
        const shopToDelete = await Shop.findOne({ _id: shopId }).exec()
        await shopToDelete.remove()
        return res.json({ message: 'Shop is deleted.' })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}


export default { isSeller, createShop, listShops,
    getLogo, getShopList, getShopById, getShop,
    isOwner, updateShop, removeShop,
}