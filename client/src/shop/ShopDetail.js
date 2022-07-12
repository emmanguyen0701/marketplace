import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Card, CardContent, Typography,
    Avatar, Button, Grid, Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { listShopDetail } from './api-shop'
import { getProductsByShop } from '../product/api-product'
import Products from '../product/Products'

const ShopDetail = () => {
    const [shop, setShop] = useState({
        name: '',
        description: '',
    })
    const [products, setProducts] = useState([])
    const [error, setError] = useState('')
    const params = useParams()
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listShopDetail(signal, { shopId: params.shopId })
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setShop(res)
            }
        })
        getProductsByShop(signal, { shopId: params.shopId })
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setProducts(res)
            }
        })

        return () => controller.abort()
    }, [params.shopId])

    return (
    <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
            <Card>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {error && <Typography>{error}</Typography>}
                    <Typography variant='h6' sx={{ mt: '6px' }}>{shop.name.toUpperCase()}</Typography>
                    <br />
                    {shop._id && (
                        <Avatar sx={{ width: 80, height: 80 }}
                        src={`/api/shops/logo/${shop._id}`} />
                    )}
                    <br />
                    <Typography>{shop.description}</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
            <Card>  
                <Box sx={{ display: 'flex', m: '16px 0px 20px 0px', justifyContent: 'space-around' }}>
                <Typography variant='h6'>PRODUCTS</Typography>
                {shop.owner?._id === authObj?.user._id && (
                    <Link to={`/seller/${shop._id}/products/new`}>
                        <Button sx={{ bgcolor: 'secondary.main', color: 'primary.contrastText', '&:hover': { bgcolor: '#2730b0' } }}
                        >ADD NEW PRODUCT</Button>
                    </Link>    
                )}
                </Box>
                <Products products={products} searched={false} />
            </Card>
        </Grid>
    </Grid>
    )
}

export default ShopDetail

