import mongoose from "mongoose"
import { Schema } from 'mongoose'

import User from './user.model'

const AuctionSchema = new Schema({
    itemName: {
        type: String,
        required: 'Name of bidding item is required',
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    seller: {
        ref: User,
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
    bidStart: {
        type: Date,
        default: Date.now,
    },
    bidEnd: {
        type: Date, 
        required: 'Auction end time is required',
    },
    startingBid: {
        type: Number,
        default: 0,
    },
    bids: [{
        bidder: { type: Schema.Types.ObjectId, ref: User,},
        bid: Number,
        time: {
            type: Date,
            default: Date.now
        },
    }]
})

const Auction = mongoose.model('Auction', AuctionSchema)

export default Auction

