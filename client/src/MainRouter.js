import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Menu from './components/Menu'
import PrivateRoute from './auth/PrivateRoute'
import Home from './components/Home'
import EditProfile from './users/EditProfile'
import Signin from './auth/Signin'
import Signup from './users/Signup'
import Users from './users/Users'
import Profile from './users/Profile'
import Shops from './shop/Shops'
import NewShop from './shop/NewShop'
import MyShop from './shop/MyShop'
import ShopDetail from './shop/ShopDetail'
import EditShop from './shop/EditShop'
import NewProduct from './product/NewProduct'
import EditProduct from './product/EditProduct'
import ProductDetail from './product/ProductDetail'
import Cart from './cart/Cart'
import StripeConnect from './users/StripeConnect'
import { CartProvider } from './contexts/Cart'
import ShopOrders from './order/ShopOrders'
import MyOrder from './order/MyOrder'
import MobileMenu from './components/MobileMenu'
import useWindowDimension from './hook/useWindowDimension'


const MainRouter = () => {
    const windowDimension = useWindowDimension()
    const isMobile = windowDimension <= 860

    return (
        <CartProvider>
            { isMobile ? <MobileMenu /> : <Menu /> } 
            <Routes>
                <Route path='/' element={<Home />} />
                
                <Route path='signin' element={<Signin />} />
                <Route path='signup' element={<Signup />} />
                <Route path='users' element={<Users />} />
                <Route path='/users/edit/:userId' element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                } />
                <Route path='/users/:userId' element={<Profile />} />    
                <Route path='/shops/all' element={<Shops />} />
                <Route path='/shops/:shopId' element={<ShopDetail />} />
                <Route path='/seller/shops' element={
                    <PrivateRoute>
                        <MyShop />
                    </PrivateRoute>
                } /> 
                <Route path='/seller/shops/new' element={
                    <PrivateRoute>
                        <NewShop />
                    </PrivateRoute>
                } />
                <Route path='/seller/shop/edit/:shopId' element={
                    <PrivateRoute>
                        <EditShop />
                    </PrivateRoute>
                } />
                <Route path='/seller/stripe/connect' element={<StripeConnect />} />
                <Route path='/seller/:shopId/products/new' element={
                    <PrivateRoute>
                        <NewProduct />
                    </PrivateRoute>
                } />
                <Route path='/seller/:shopId/:productId/edit' element={
                    <PrivateRoute>
                        <EditProduct />
                    </PrivateRoute>
                } />
                <Route path='/products/:productId' element={<ProductDetail />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/seller/orders/:shop/:shopId' element={
                    <PrivateRoute>
                        <ShopOrders />
                    </PrivateRoute>
                } />
                <Route path='/orders/:orderId' element={
                    <PrivateRoute>
                        <MyOrder />
                    </PrivateRoute>
                }
                />
            </Routes>
        </CartProvider>
    )
}

export default MainRouter