import mongoose from 'mongoose'
import { Schema } from 'mongoose'

import User from './user.model'

const ShopSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    logo: {
        data: Buffer,
        contentType: String,
    },
    owner: {
        ref: User,
        type: Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
})

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop