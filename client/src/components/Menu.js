import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { AppBar, Toolbar,
    Typography, Box, Badge,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import auth from '../auth/auth-helper'
import { useCart } from '../contexts/Cart'

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 0,
      border: `1px solid tertiary`,
      padding: '0',
    },
  }))

const Menu = () => {
    const navigate = useNavigate()
    const authObj = auth.isAuthenticated()
    const { cart } = useCart()

    return (
    <AppBar position='static'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '98%' }}>
            <Box sx={{  ml: '20px', display: 'flex', width: '360px', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600, letterSpacing: '0.2rem' }}>
                    <Link style={{ color: 'white' }} to='/'>MARKETPLACE</Link>
                </Typography>
                <Box sx={{ display: 'flex', width: '50%', justifyContent: 'space-between'  }}>
                    {authObj?.user.seller && (
                        <Link to='/seller/shops' style={{ color: 'white', fontWeight: 500 }}>MY SHOP</Link>)
                    }
                    <Link to='/shops/all' style={{ color: 'white', fontWeight: 500 }}>ALL SHOPS</Link>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', width: '160px', justifyContent: 'space-between'}}>
                {authObj ? 
                <Box sx={{ display: 'flex', width: '72%', justifyContent: 'space-between'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AccountCircleIcon sx={{ color: 'white', '&:hover': { cursor: 'pointer' } }}
                            onClick={() => navigate(`/users/${authObj.user._id}`)}/>
                        <Typography sx={{ color: 'white', fontSize: '12px' }}>My Profile</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <LogoutIcon sx={{ '&:hover': { cursor: 'pointer' } }} 
                            onClick={() => auth.clearJWT(() => navigate("/"))}/>
                        <Typography sx={{ color: 'white', fontSize: '12px' }}>Log out</Typography>
                    </Box>
                </Box> : 
                <Box sx={{ display: 'flex', width: '68%', justifyContent: 'space-between'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <PersonOutlineIcon sx={{ color: 'white', '&:hover': { cursor: 'pointer' } }} 
                        onClick={() => navigate('/signin')}
                        />
                        <Typography sx={{ color: 'white', fontSize: '12px' }}>Sign in</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <PersonAddAltIcon sx={{ color: 'white', '&:hover': { cursor: 'pointer' } }} 
                        onClick={() => navigate('/signup')}
                        />
                        <Typography sx={{ color: 'white', fontSize: '12px' }}>Sign up</Typography>
                    </Box>
                </Box>}
                <Box sx={{ pt:'6px',  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Link to='/cart'>
                        <StyledBadge badgeContent={cart.length} color='tertiary'>
                                <AddShoppingCartIcon sx={{ color: 'white' }} />
                        </StyledBadge>
                    </Link>
                    <Typography sx={{ color: 'white', fontSize: '12px' }}>Cart</Typography>
                </Box>
            </Box>
        </Toolbar>
    </AppBar>
    )
}

export default Menu