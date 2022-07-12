import mongoose from "mongoose"
import { Schema } from 'mongoose'

import Product from "./product.model"
import Shop from './shop.model'
import User from "./user.model"

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: Product,
    },
    quantity: Number,
    shop: {
        type: Schema.Types.ObjectId,
        ref: Shop,
    },
})

const CartItem = mongoose.model('CartIten', CartItemSchema)

const OrderSchema = new Schema({
    products: [CartItemSchema],
    customer_name: {
        type: String,
        required: 'Name is required',
    },
    customer_email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        required: 'Email is required',
    },
    delivery_address: {
        street: { type: String, required: 'Street is required' },
        city: { type: String, required: 'City is required' },
        state: { type: String },
        country: { type: String, required: 'Country is required' },
        zipcode: { type: String, required: 'Zipcode is required' },
    },
    status: {
        type: String,
        default: 'Not processed',
        enum: ['Not processed', 'Shipped', 'Delivered', 'Cancelled']
    },
    payment_id: '',
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
})

const Order = mongoose.model('Order', OrderSchema)

export { CartItem, Order }