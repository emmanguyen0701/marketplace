import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Paper, Typography,
    List, ListItem, Box,
    Avatar, ListItemAvatar,
    Divider
} from '@mui/material'

import { listShops } from './api-shop'

const Shops = () => {
    const [shops, setShops] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listShops(signal).then(res => {
            if (res && res.error) {
                console.log(res.error)
            } else {
                setShops(res)
            }
        })

        return () => controller.abort()
    }, [])

    return (
    <Paper sx={{ textAlign: 'center' }}>
        <Typography variant='h5' sx={{ color: 'secondary.main', pb: '4px', pt: '20px' }}>ALL SHOPS
        </Typography>
        <List sx={{m: 'auto',width: '60%', minWidth: '380px'}}>
            {shops.map((shop, idx) => (
                <Link to={`/shops/${shop._id}`} key={idx}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 50, height: 50, mr: '10px' }}
                            src={`/api/shops/logo/${shop._id}`}
                            />
                        </ListItemAvatar>
                        <Box sx={{ display: 'block' }}>
                            <Typography variant='h6' sx={{ color: 'secondary.main' }}>{shop.name}</Typography>
                            <Typography variant='subtitle2' sx={{ color: '#000' }}>{shop.description}</Typography>
                        </Box>
                    </ListItem>
                    <Divider variant='middle' />
                </Link>
            ))}
        </List>
    </Paper>
    )
}

export default Shops