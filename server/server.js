import config from '../config/config'
import app from './express'
import mongoose from 'mongoose'
import bidding from './controllers/bidding.controller'

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(() => console.log("Database connected"))
    .catch((err) => console.log(err))

const server = app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server started on port ${config.port}`)
})

bidding(server)