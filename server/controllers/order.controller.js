import dbErrorHandler from "../helpers/dbErrorHandler"

import { Order } from '../models/order.model'

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
                                .populate('products.product', '_id name price')
                                .exec()
    
        if (!order) {
            return res.status(400).json({ error: "Couldn't find order." })
        }
        return res.status(200).json(order)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const createOrder = async (req, res, next) => {
    try {
        const order = new Order(req.body)
        order.user = req.profile
        const result = await order.save()
        req.order = result
        next()
    } catch(err) {
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })
    }
}

export const getOrdersByShop = async (req, res) => {
    try {
        const orders = await Order.find({ 'products.shop': req.shop.id })
                                .populate('products.product', '_id name price')
                                .sort('-createdAt')
                                .exec()
        return res.status(200).json(orders)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })   
    }
}

export const getStatusValues = (req, res) => {
    try {
        return res.status(200).json(Order.schema.path('status').enumValues)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })   
    }
}

const cancelOrder = async (req, res, next) => {
    try {
        const orderToDelete = await Order.findById(req.params.orderId).exec()
        if (!orderToDelete) {
            return res.status(400).json({ error: 'Order not found.' })
        } 
        await orderToDelete.remove()
        next()
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })   
    }
}

const updateStatus = async (req, res, next) => {
    try {
        const order = await Order.updateOne(
            { _id: req.body.orderId },
            { $set: { status: req.body.status } })

        return res.status(200).json(order)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })   
    }
}

const getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
        return res.status(200).json(orders)
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: dbErrorHandler.getErrorMessage(err)
        })   
    }
}

export default { getOrderById, createOrder, getOrdersByShop, getStatusValues, 
    cancelOrder, updateStatus, getOrdersByUser, }