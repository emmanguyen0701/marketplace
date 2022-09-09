import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'

import devBundle from './devBundle'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import shopRoutes from './routes/shop.routes'
import productRoutes from './routes/product.routes'
import orderRoutes from './routes/order.routes'
import auctionRoutes from './routes/auction.routes'

import template from '../template'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

devBundle.compile(app)


app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))
app.use('/client/src/public/js', express.static(path.join(CURRENT_WORKING_DIR, 'client/src/public/js')))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())
app.use(compression())
app.use(helmet())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/shops', shopRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auctions', auctionRoutes)

app.get('*', (req, res, next) => {
    res.send(template())
    next()
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            'error': err.name + " : " + err.message
        })
    } else if (err) {
        console.log(err)
        return res.status(400).json({
            'error': err.name + ' : ' + err.message
        })
    }
})

export default app