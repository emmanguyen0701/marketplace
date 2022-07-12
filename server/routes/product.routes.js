import express from 'express'

import authController from '../controllers/auth.controller'
import shopController from '../controllers/shop.controller'
import productController from '../controllers/product.controller'

const routes = express.Router()

routes.get('/api/products', productController.getProductsByShop)

routes.get('/api/products/categories', productController.getCategories)

routes.get('/api/products/latest', productController.getLatestProducts)

routes.get('/api/products/related/:productId', productController.getRelatedProducts)

routes.get('/api/products/:productId', productController.getProduct)

routes.get('/api/product/image/:productId', productController.getProductImage)

routes.post('/api/products/by/:shopId', 
    authController.requireSignin,
    shopController.isOwner,
    productController.createProduct,
)
routes.get('/api/products/by/:shopId', productController.getProductsByShopByShop)

routes.put('/api/product/:shopId/:productId', 
    authController.requireSignin,
    shopController.isOwner,
    productController.updateProduct,
)

routes.delete('/api/product/:shopId/:productId',
    authController.requireSignin,
    shopController.isOwner,
    productController.deleteProduct,
)

routes.param('shopId', shopController.getShopById)

routes.param('productId', productController.getProductById)

export default routes