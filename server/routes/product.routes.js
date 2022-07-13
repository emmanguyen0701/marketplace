import express from 'express'

import authController from '../controllers/auth.controller'
import shopController from '../controllers/shop.controller'
import productController from '../controllers/product.controller'

const routes = express.Router()

routes.get('/', productController.getProductsByShop)

routes.get('/categories', productController.getCategories)

routes.get('/latest', productController.getLatestProducts)

routes.get('/related/:productId', productController.getRelatedProducts)

routes.get('/:productId', productController.getProduct)

routes.get('/image/:productId', productController.getProductImage)

routes.post('/by/:shopId', 
    authController.requireSignin,
    shopController.isOwner,
    productController.createProduct,
)
routes.get('/by/:shopId', productController.getProductsByShopByShop)

routes.put('/:shopId/:productId', 
    authController.requireSignin,
    shopController.isOwner,
    productController.updateProduct,
)

routes.delete('/:shopId/:productId',
    authController.requireSignin,
    shopController.isOwner,
    productController.deleteProduct,
)

routes.param('shopId', shopController.getShopById)

routes.param('productId', productController.getProductById)

export default routes