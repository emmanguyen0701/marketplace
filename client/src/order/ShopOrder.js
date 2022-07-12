import React, { useState } from 'react'

import { ListItem, ListItemButton, Typography,
    Divider, Box, 
    ListItemText, Collapse, 
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

import ProductOrderEdit from './ProductOrderEdit'

const ShopOrder = ({ order, updateOrders, orderIdx }) => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(!open)

    return (
    <ListItem sx={{ display: 'block' }}>
        <ListItemButton onClick={handleOpen} 
        sx={{ pl: '0px', mt: 0, pt: 0, fontSize: '19px', color: 'info.hover', }}>
            <ListItemText 
                primary={`Order #${order._id}`}
                secondary={`Created at ${new Date(order.createdAt).toDateString()}`}
            />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout='auto' unmountOnExit>
            <ProductOrderEdit order={order} updateOrders={updateOrders} orderIdx={orderIdx} />
        </Collapse>
        <Box sx={{ mb: '10px' }}>
            <Typography sx={{ fontSize: '18px',}}>Deliver to:</Typography>
            <Box sx={{ color: '#585a5e', }}>
                <Typography sx={{ fontSize: '15px' }}>{order.customer_name} ({order.customer_email})</Typography>
                <Typography sx={{ fontSize: '14px' }}>{order.delivery_address.street}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{order.delivery_address.city}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{order.delivery_address.state}, {order.delivery_address.zipcode}</Typography>
                <Typography sx={{ fontSize: '14px' }}>{order.delivery_address.country}</Typography>
            </Box>
        </Box>
        <Divider />
    </ListItem>
    )

}

export default ShopOrder