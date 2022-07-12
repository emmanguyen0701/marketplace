import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Typography, Button, Box, Divider, 
} from '@mui/material'

import { getOrdersByUsers } from './api-order'
import auth from '../auth/auth-helper'
import useWindowDimension from '../hook/useWindowDimension'

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const [errors, setErrors] = useState('')
    
    const windowDimension = useWindowDimension()
    const isMobile = windowDimension < 800
    const params = useParams()
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getOrdersByUsers({ userId: params.userId }, { t: authObj.token }, signal)
        .then(res => {
            if (res && res.error) {
                setErrors(res)
            } else {
                setMyOrders(res)
            }
        })

        return () => controller.abort()
    }, [])

    return (
    <Box sx={{  m: '20px', pb: '16px' }}>
        <Typography sx={{ 
            mb: '5px',
            color: 'info.main',
        }} variant='h6'>My Orders</Typography>
        { !!myOrders.length
        ? myOrders.map((order,idx) => (
            <Box key={idx}>
                <Box sx={{ display: 'flex', pb: '10px', pt: '5px', pr: !isMobile ? '60px' : 0, alignItems: 'center', width: '98%', justifyContent: 'space-between' }}>
                    <Typography>Order Number: #{order._id}</Typography>
                    <Button sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.hover' } }}>
                        <Link style={{ color: 'white' }} to={`/orders/${order._id}`}>View Order</Link>
                    </Button>
                </Box>
                <Divider />
            </Box>
        ))
        : <Typography>You don't have orders.</Typography>
        }
    </Box>
    )
}

export default MyOrders