import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import crypto from 'crypto'

import User from './user.model'

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    password: {
        type: String,
        required: true, 
    },
    salt: {
        type: String,
        required: true,
    }
})

ProfileSchema.methods = {
    encryptPassword: function(plainText) {
        return crypto.createHmac('sha256', this.salt)
            .update(plainText)
            .digest('hex')
    },
    authenticate: function(plainText) {
        return this.password === this.encryptPassword(plainText)
    },
}
const Profile = mongoose.model('Profile', ProfileSchema)

export default Profile