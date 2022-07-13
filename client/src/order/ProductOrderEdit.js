import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useStripe, useElements } from '@stripe/react-stripe-js'

import { List, ListItem, ListItemText, Box, 
    MenuItem, Select,
    Button, Typography,
} from '@mui/material'

import { getStatusValues, cancelOrder, updateOrderStatus } from './api-order'
import auth from '../auth/auth-helper'
import { capitalizeFirstLetter } from '../utils/helperFunctions'

const ProductOrderEdit = ({ order, updateOrders, orderIdx }) => {
    const [values, setValues] = useState({
        status: [],
        error: '',
        redirect: false,
    })
    const params = useParams()
    const authObj = auth.isAuthenticated()
    const stripe = useStripe()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getStatusValues(signal).then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            }
            else {
                setValues({ ...values, status: res })
            }
        })

        return () => controller.abort()
    }, [])

    const handleStatusSelect = async (event) => {
        event.preventDefault()
        let orderToBeUpdated = order
        orderToBeUpdated.status = event.target.value
        let res

        if (event.target.value === 'Cancelled') {
            res = await cancelOrder(
                        { shopId: params.shopId, orderId: order._id },
                        { t: authObj.token }, 
                        orderToBeUpdated.products)
        } else {
            res = await updateOrderStatus(
                { shopId: params.shopId },
                { t: authObj.token },
                { status: event.target.value, orderId: order._id })
        }
        if (res && res.error) {
            setValues({ ...values, error: res.error })
        } else {
            updateOrders(orderIdx, order)
        }
    }

    return (
    <List sx={{ pt: '0' }}>
        {values.error && (
            <Typography sx={{ color: 'error.main' }}>{values.error}</Typography>
        )}
        {order?.products.map((item, idx) => {
            if (item.shop === params.shopId) {
                return (
                    <ListItem key={idx}>
                        <ListItemText primary={<Box sx={{ display: 'flex', minWidth: '280px', width: '32%',  }}>
                            <img style={{ objectFit: 'contain', width: '100px', height: '100%', marginRight: '20px'  }}
                                        src={`/api/products/image/${item.product._id}`} />
                            <div>
                                <div style={{ fontSize: '18px' }}>{capitalizeFirstLetter(item.product.name)}</div>
                                <p style={{ color: '#585a5e' }}>Quantity: {item.quantity}</p>
                            </div>
                        </Box>} />
                    </ListItem>)    
            }
        })}
        <Box sx={{ display: 'flex', width: '50%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Update Order Status</Typography>
            { !!values.status.length && (
                <Select 
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Update status'
                    disabled={!stripe}
                    value={order.status}
                    onChange={handleStatusSelect}>
                    {values.status.map((value, idx) => (
                        <MenuItem key={idx} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                    </Select>
                )}
        </Box>
    </List>
    )
}

export default ProductOrderEdit