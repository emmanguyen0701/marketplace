import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Paper, Typography, List, Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { getOrdersByShop } from './api-order'
import ShopOrder from './ShopOrder'
import { capitalizeFirstLetter } from '../utils/helperFunctions'

const ShopOrders = () => {
    const [orders, setOrders] = useState([])
    const [updated, setUpdated] = useState(false)

    const [error, setError] = useState('')

    const params = useParams()

    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        
        getOrdersByShop({ shopId: params.shopId }, { t: authObj.token }, signal)
        .then(res => {
            if (res && res.error) setError(res.error)
            else setOrders(res)
        })

        return () => controller.abort()
    }, [updated])

    const updateOrders = (index, orderToBeUpdate) => {
        const updatedOrders = [...orders]
        updatedOrders[index] = orderToBeUpdate
        setOrders(updatedOrders)
        setUpdated(!updated)
    }

    return (
    <Paper>
        <Box sx={{ textAlign: 'center', pt: '22px' }}>
            <Typography variant='h5'>List of Orders - {capitalizeFirstLetter(params.shop)}</Typography>
        </Box>
        {error &&
        <Typography sx={{ color: 'error.main' }}>{error}</Typography>}
        <List>
            {orders?.map((order, idx) => (
                <ShopOrder order={order} key={idx} orderIdx={idx} updateOrders={updateOrders} />
            ))}
        </List>
    </Paper>
    )
}

export default ShopOrders