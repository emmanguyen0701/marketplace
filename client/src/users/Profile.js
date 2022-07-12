import React, { useState, useEffect } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'

import { Paper, Typography,
    List, ListItem, ListItemAvatar,
    Avatar, ListItemText, ListItemButton,
    Divider, Button, Box, 
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import auth from '../auth/auth-helper'
import { readUser } from './api-user'
import DeleteProfile from './DeleteProfile'
import MyOrders from '../order/MyOrders'
import stripeButton from '../assets/images/stripeButton.png'
import useWindowDimension from '../hook/useWindowDimension'

const Profile = ()  => {
    const params = useParams()
    const navigate = useNavigate()
    const windowDimension = useWindowDimension()
    const isMobile = windowDimension < 800

    const authObj = auth.isAuthenticated()
    
    const [values, setValues] = useState({
        user: {
            email: '',
            name: '',
            createdAt: '',
        },
        redirectToSignin: false,
    })
    const [openDelete, setOpenDelete] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        if (!authObj) {
            setValues({ ...values, redirectToSignin: true })
        } else {
            readUser({ userId: params.userId }, { t: authObj.token }, signal)
            .then(res => {
                if (res && res.error) {
                    console.log(res.error)
                } else {
                    setValues({ ...values, user: res })
                }
            })
        }

        return () => controller.abort()
    }, [params.userId, openDelete])

    const handleClickOpenDelete = () => {
        setOpenDelete(true)
    }

    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    if (values.redirectToSignin) {
        return <Navigate to='/signin' state={{ from: `/users/${params.userId}` }} />
    }

    if (!authObj && !openDelete) {
        return <Navigate to='/signin' />
    }

    return (
    <Paper sx={{
        pt: '2px',
        maxWidth: '900px',
        margin: 'auto',
        borderRadius: '2px',
    }}>
        <Typography sx={{ 
            m: '20px',
            mb: '0px',
            color: 'primary.main',
         }} variant='h6'>Profile</Typography>
        <List sx={{ display: 'flex', flexDirection: isMobile ? 'column' : '', pr: '80px', alignItems: 'center' }}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <PersonIcon />
                    </Avatar>
                </ListItemAvatar>  
                <ListItemText primary={values.user.name} secondary={values.user.email} />
            </ListItem>
            {authObj && authObj.user._id === params.userId && (
                    <ListItem sx={{ display: 'flex', pl: 0, maxWidth: '380px' }}>
                        <ListItemButton>
                            {authObj.user.seller && (
                                authObj.user.stripe_seller
                                ? <Button disabled={true}>Stripe Connected</Button>
                                : <a href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_LSoClAlVPDyXmYWJeSWu3OQIAnvYvCMZ&scope=read_write`}>
                                    <img src={stripeButton} style={{ objectFit: 'cover' }} />
                                </a>
                            )}
                        </ListItemButton>
                        <Box sx={{ display: 'flex', minWidth: '140px', width: '160px', justifyContent: 'space-between' }}>
                            <Box sx={{ pt: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <EditIcon  
                                sx={{ color: 'secondary.main', '&:hover': { cursor: 'pointer' } }}
                                onClick={() => navigate(`/users/edit/${values.user._id}`)}
                                />
                                <Typography sx={{ color: '#000', fontSize: '12px' }}>Edit Profile</Typography>
                            </Box>
                            <Box sx={{ pt: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <DeleteIcon  
                                sx={{ color: 'error.main', '&:hover': { cursor: 'pointer' } }}
                                onClick={handleClickOpenDelete}
                                />
                                <Typography sx={{ color: '#000', fontSize: '12px' }}>Delete Profile</Typography>
                            </Box>
                        </Box>
                        <DeleteProfile 
                            open={openDelete}
                            onClose={handleCloseDelete}
                        />
                    </ListItem>)
                }
        </List>
        <Divider />
        <List>
            <ListItem>
                <ListItemText primary={
                    <Typography variant='body2'>
                        Joined: {(new Date(values.user.createdAt)).toDateString()}
                    </Typography>} />
            </ListItem>
        </List>
        <Box>
           <MyOrders />
        </Box>
    </Paper>
    )
}

export default Profile