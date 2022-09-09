import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardContent, 
    CardMedia, 
    Typography, Box, Grid,
} from '@mui/material'

import Suggestions from './Suggestions'
import { getRelatedProducts, listProductDetail } from './api-product'
import AddToCart from '../cart/AddToCart'
import { capitalizeFirstLetter } from '../utils/helperFunctions'

const ProductDetail = () => {
    const [related, setRelated] = useState([])
    const [product, setProduct] = useState({
        image: '',
        name: '',
        description: '',
        category: '',
        quantity: '',
        price: '',
    })
    const [error, setError] = useState('')
    const params = useParams()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listProductDetail(signal, { productId: params.productId })
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setProduct(res)
            
            }
        })
        getRelatedProducts(signal, { productId: params.productId })
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setRelated(res)
            }
        })
    
        return () => controller.abort()
    }, [params.productId])


    return (
    <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
            <Card sx={{  minHeight: '340px',  pt: '16px' }}>
                <CardContent sx={{  p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Box>
                            <Typography variant='h6' sx={{ fontWeight: '600' }}>{capitalizeFirstLetter(product.name)}</Typography>
                            {product.quantity > 0
                            ? (<Typography variant='body2' sx={{ color: '#5e5855' }}>In stock</Typography>)
                            : (<Typography variant='body2' sx={{ color: 'primary.main', fontWeight: 600 }}>Out of stock</Typography>)}
                        </Box>
                    </Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            {product._id && (
                                <CardMedia 
                                component='img'
                                alt={product.name}
                                sx={{ objectFit: 'contain', minHeight: '80px', height: '140px' }}
                                image={`/api/products/image/${product._id}`}
                            />)}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ minHeight: '100px', pl: '12px'  }}>
                                <Typography variant='body2' sx={{ color: '#5e5855' }}>{product.description}</Typography>
                            </Box>
                            <Box sx={{ mt: '16px', pl: '12px' }}>
                                <Typography sx={{ fontSize: '20px', color: 'primary.main', fontWeight: '600' }}>${product.price}</Typography>
                                <Typography sx={{ mt: '10px' }}>Category: {product.category}</Typography>
                            </Box>
                            {product.quantity > 0 && (
                                <Box sx={{ mt: '10px', mr: '26px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <AddToCart item={product} />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#fcfffd', minHeight: '340px' }}>
                <Suggestions products={related} title={'Related Products'} />
            </Card>
        </Grid>
    </Grid>
    )
}

export default ProductDetail