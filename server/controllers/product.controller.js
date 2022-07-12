import fs from 'fs'
import formidable from 'formidable'
import { assignIn } from 'lodash'

import dbErrorHandler from '../helpers/dbErrorHandler'
import Product from '../models/product.model'

export const getProductById = async (req, res, next, productId) => {
    try {
        const product = await Product.findById(productId)
                                .populate('shop', '_id name')
                                .exec()
        if (!product) {
            return res.status(400).json({
                error: 'Product not found.'
            })
        }
        req.product = product
        next()
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category', {})
                                    .exec()
        return res.status(200).json(categories)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getProductsByShop = async (req, res) => {
    const query = {}
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' }
    }
    if (req.query.category && req.query.category !== 'all') {
        query.category = req.query.category
    }
    try {
        const products = await Product.find(query)
                                    .populate('shop', '_id name')
                                    .exec()
        return res.status(200).json(products)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
} 

export const getLatestProducts = async (req, res) => {
    try {
        const products = await Product.find({})
                            .sort('-createdAt')
                            .populate('shop', '_id name')
                            .limit(5)
                            .exec()
        return res.status(200).json(products)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getRelatedProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id : { $ne: req.product._id } , 
                                            category: { $eq: req.product.category } })
                                    .populate('shop', '_id name')
                                    .exec()
        return res.status(200).json(products)                            
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const createProduct = (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded.'
            })
        }
        const product = await new Product(fields)
        product.shop = req.shop
        if (files.image) {
            product.image.data = fs.readFileSync(files.image.filepath)
            product.image.contentType = files.image.mimetype
        }
        try {
            await product.save()
            return res.status(200).json({
                message: 'Product created.'
            })
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
        }
    })
}

export const getProductImage = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.productId }).exec()
        if (!product) {
            return res.status(400).json({
                error: "Couldn't find the product."
            })
        }
        res.set('Content-Type', product.image.contentType)
        return res.status(200).send(product.image.data)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getProductsByShopByShop = async (req, res) => {
    try {
        const products = await Product.find({ shop: req.shop })
                            .populate('shop', '_id name')
                            .select('-image')
                            .exec()
        return res.status(200).json(products)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getProduct = (req, res) => {
    try {
        const product = req.product
        product.image = undefined 
        return res.status(200).json(product)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Logo could not be uploaded.'
            })
        }
        let product = req.product
        product = assignIn(product, fields)
        product.updatedAt = Date.now()
        if (files.image) {
            product.image.data = fs.readFileSync(files.image.filepath)
            product.image.contentType = files.image.mimetype
        }
        try {
            await product.save()
            return res.status(200).json({
                message: "product updated."
            })
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
        }
    })
}

export const deleteProduct = async (req, res) => {
    try {
        const productToDelete = await Product.findById(req.params.productId).exec()
        if (!productToDelete) {
            return res.status(400).json({
                error: 'Product not found.'
            })
        }
        await productToDelete.remove()
        return res.status(200).json({
            message: 'Product deleted.'
        })
    } catch(err) {
            console.log(err)
            return res.status(500).json({
                error: dbErrorHandler.getErrorMessage(err)
            })
    }
}

export const decreaseStockQuantity = async (req, res, next) => {
    const bulkOps = req.body.products.map(item => {
        return {
            updateOne: {
                'filter': { '_id': item.product._id },
                'update': { $inc: { 'quantity': -item.quantity  } }
            }
        }
    })
    try {
        await Product.bulkWrite(bulkOps)
        next()
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: "Couldn't update the product."
        })
    }
}

const increaseStockQuantity = async (req, res, next) => {
    const bulkOps = req.body.map(item => {
        return {
            updateOne: {
                'filter': { '_id': item.product._id },
                'update': { $inc: { 'quantity': item.quantity } }
            }
        }
    })
    try {
        await Product.bulkWrite(bulkOps)
        return res.status(200).json({ message: 'order deleted.' })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: "Couldn't update the product."
        })
    }
}

export default { getProductById, getProductsByShop, getRelatedProducts, 
    getLatestProducts, createProduct, getProductImage, getProductsByShopByShop, 
    getProduct, updateProduct, deleteProduct, getCategories,
    decreaseStockQuantity, increaseStockQuantity, 
}