import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        required: 'Email is required',
    },
    seller: {
        type: Boolean,
        default: false,
    },
    stripe_seller: {},
    stripe_customer: {},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
})

const User = mongoose.model('User', UserSchema)

export default User