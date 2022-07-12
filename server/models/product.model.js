import mongoose from 'mongoose'
import { Schema } from 'mongoose'

import Shop from './shop.model'

const ProductSchema = new Schema({
    name: {
        type: String,
        required: 'Name of product is required.',
    },
    description: String,
    image: {
        data: Buffer,
        contentType: String,
    },
    category: String,
    quantity: {
        type: Number,
        required: 'Quantity of product is required.'
    },
    price: {
        type: Number,
        required: 'Price of product is required.'
    },
    shop: {
        ref: Shop,
        type: Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
})

const Product = mongoose.model('Product', ProductSchema)

export default Product