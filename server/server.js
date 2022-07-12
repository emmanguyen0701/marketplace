import config from '../config/config'
import app from './express'
import mongoose from 'mongoose'

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(() => console.log("Database connected"))
    .catch((err) => console.log(err))

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server started on port ${config.port}`)
})