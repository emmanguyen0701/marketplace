import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Typography, Card, 
    CardMedia, Box,
    Divider, 
} from '@mui/material'

import { capitalizeFirstLetter } from '../utils/helperFunctions'
import { getOrder } from './api-order'
import auth from '../auth/auth-helper'
import useWindowDimension from '../hook/useWindowDimension'

const MyOrder = () => {
    const [order, setOrder] = useState({})
    const [error, setError] = useState('')

    const params = useParams()
    const windowDimension = useWindowDimension()
    const isMobile = windowDimension < 800
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getOrder({ orderId: params.orderId }, { t: authObj.token }, signal)
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setOrder(res)
            }
        })

        return () => controller.abort()
    }, [])

    const getTotal = (productList) => {
        const total = productList.reduce((prev, curr) => {
            return prev + curr.product.price * Number(curr.quantity)
        }, 0)
        return parseFloat(total).toFixed(2)
    }


    return (
    <Box>
        {error && <Typography sx={{ color: 'error.main', mt: '8px' }}>{error}</Typography>}
        {order && !!Object.keys(order).length &&
        (<Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt: '8px', mb: '10px' }}>
                <Typography variant='h5' sx={{ color: 'info.main', m: '7px auto' }}>My Order</Typography>
                <Typography sx={{ fontSize: '14px', color: 'tertiary.contrastText' }}>Order Number: #{order._id}</Typography>
                <Typography sx={{ fontSize: '14px', color: 'tertiary.contrastText' }}>Place on: {new Date(order.createdAt).toDateString()}</Typography> 
            </Box>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : '', alignItems: 'center', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: '380px', minWidth: '280px', pt: '20px', borderRadius: '2px' }}>
                    {order.products.map((item, idx) => (
                        <Card elevation={0} variant='outlined' key={idx} sx={{ display: 'flex', borderRadius: '1px', m: '3px 7px' }}>
                            <CardMedia 
                                component='img'
                                alt={item.product.name}
                                image={`/api/product/image/${item.product._id}`}
                                sx={{ objectFit: 'contain', height: '170px', width: '40%' }}
                            />
                            <Box sx={{ width: '60%', pl: '30px', mt: '4px' }}> 
                                <Typography sx={{ fontSize: '22px', pt: '14px', color: 'secondary.main' }}>{capitalizeFirstLetter(item.product.name)}</Typography>
                                <Typography sx={{ fontSize: '16px', pt: '6px', color: 'tertiary.contrastText' }}>${item.product.price} x {item.quantity}</Typography>
                                <Typography sx={{ fontSize: '16px', pt: '8px', color: 'tertiary.contrastText' }}>Order Status: {order.status}</Typography>
                            </Box>
                        </Card>
                    ))}   
                    <Box sx={{ mt: '12px', mb: '8px', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Typography sx={{ fontWeight: '600', fontSize: '21px' }}>Total: ${getTotal(order.products)}</Typography>
                    </Box> 
                </Card>
                <Card sx={{  width: '380px', minWidth: '280px', mt: '2px', borderRadius: '2px' }}>
                    <Box sx={{ pl: '30px', pt: '10px', pb: '20px' }}>
                        <Typography variant='h6' sx={{ color: 'tertiary.contrastText' }}>Customer Details:</Typography>
                        <Typography sx={{ ml: '20px', fontSize: '16px' }}>{order.customer_name}</Typography>
                        <Typography sx={{ ml: '20px', fontSize: '16px' }}>{order.customer_email}</Typography>
                    </Box>
                    <Divider variant="middle" />
                    <Box sx={{ pl: '30px', pt: '10px', pb: '20px' }}>
                        <Typography variant='h6' sx={{ color: 'tertiary.contrastText', pb: '8px' }}>Shipping Details:</Typography>
                        <Typography sx={{ ml: '20px', fontSize: '14px' }}>{order.delivery_address.street}</Typography>
                        <Typography sx={{ ml: '20px', fontSize: '14px' }}>{order.delivery_address.city}, {order.delivery_address.state}, {order.delivery_address.country}</Typography>
                        <Typography sx={{ ml: '20px', fontSize: '14px' }}>{order.delivery_address.zipcode}</Typography>

                    </Box>
                </Card>
             </Box>
        </Box>)}
    </Box>
    )
}

export default MyOrder