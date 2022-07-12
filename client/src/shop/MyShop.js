import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Paper, Typography, Button,
    List, ListItem, Box,
    Avatar, ListItemAvatar,
    Divider
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import auth from '../auth/auth-helper'
import { listMyShops } from './api-shop'
import useWindowDimension from '../hook/useWindowDimension'
import DeleteShop from './DeleteShop'

const MyShop = () => {
    const [values, setValues] = useState({
        shops: [],
        error: ''
    })
    const [deleteOpen, setDeleteOpen] = useState(false)
    const navigate = useNavigate()
    const windowDimension = useWindowDimension()
    const isMobile = windowDimension < 760
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listMyShops(signal, {userId: authObj.user._id}, {t: authObj.token})
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, shops: res })
            }
        })

        return () => controller.abort()
    }, [])

    const handleDeleteOpen = () => {
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }

    const updateShop = (shop) => {
        const updatedShop = [...values.shops]
        const index = updatedShop.indexOf(shop)
        updatedShop.splice(index, 1)
        setValues({ ...values, shops: updatedShop })
    }

    return (
    <Paper sx={{ textAlign: 'center', }}>
        <Box sx={{ pt: '22px', display: 'flex', width:  !isMobile ? '58%' : '80%', m: 'auto', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h5' sx={{ color: 'secondary.main'}}>
                MY SHOP
            </Typography>
            <Button sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.hover' } }}>
                <Link to='/seller/shops/new' style={{ color: 'white' }}
                >CRREATE NEW SHOP</Link>
            </Button>
        </Box>
        {values.error && (
            <Typography variant='h5' sx={{ color: 'error.main', pb: '4px', pt: '20px' }}>
                {values.error}
            </Typography>
        )}
        <List sx={{m: 'auto', width: '70%', minWidth: '360px', maxWidth: '800px'}}>
            {values.shops.map((shop, idx) => (
                <Box key={idx}>
                    <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex' }}>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 50, height: 50, mr: '10px' }}
                                src={`/api/shops/logo/${shop._id}?${new Date().getTime()}`}
                                />
                            </ListItemAvatar>
                            <Box sx={{ display: 'block' }}>
                                <Link to={`/shops/${shop._id}`}>
                                    <Typography variant='h6' sx={{ color: 'secondary.main' }}>{shop.name}</Typography>
                                </Link>   
                                <Typography variant='subtitle2' sx={{ color: '#000' }}>{shop.description}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', minWidth: '100px', width: '25%', justifyContent: 'space-between' }}>
                            <Box sx={{  pr: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <EditIcon  
                                sx={{ color: 'secondary.main', '&:hover': { cursor: 'pointer' } }}
                                onClick={() => navigate(`/seller/shop/edit/${shop._id}`)}
                                />
                                <Typography sx={{ color: '#000', fontSize: '12px' }}>Edit Shop</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <DeleteIcon  
                                sx={{ color: 'error.main', '&:hover': { cursor: 'pointer' } }}
                                onClick={handleDeleteOpen}
                                />
                                <Typography sx={{ color: '#000', fontSize: '12px' }}>Delete Profile</Typography>
                            </Box>
                            <DeleteShop 
                                open={deleteOpen}
                                onClose={handleDeleteClose}
                                shop={shop}
                                onDeleteShop={updateShop}
                            />
                        </Box>
                    </ListItem>
                    <Divider variant='middle' />
                </Box>
            ))}
        </List>
    </Paper>
    )
}

export default MyShop