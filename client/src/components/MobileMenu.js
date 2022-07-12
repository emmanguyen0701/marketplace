import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AppBar, Toolbar, Container,
    Typography, Box, Badge, IconButton,
    Menu, MenuItem,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

import auth from '../auth/auth-helper'
import { useCart } from '../contexts/Cart'


const pages = [
    { page: 'All Shops', link: '/shops/all' },
    { page: 'Sign in', link: '/signin' },
    { page: 'Sign up', link: '/signup' }
]

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 0,
      border: `1px solid tertiary`,
      padding: '0',
    },
  }))

const MobileMenu = () => {
    const navigate = useNavigate()

    const [anchorElNav, setAnchorElNav] = useState(null)
    const { cart } = useCart()
    const authObj = auth.isAuthenticated()
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    return (
    <AppBar position='static'>
        <Container maxWidth='xl'>
            <Toolbar disableGutters>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                    <IconButton
                        size='large'
                        color='inherit'
                        aria-controls='menu-appbar'
                        onClick={handleOpenNavMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                    id='menu-appbar'
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    sx={{ display: 'block' }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    >
                    {authObj ?
                    <Box>
                        {authObj.user.seller && 
                        (<MenuItem key={'myShop'} onClick={handleCloseNavMenu} sx={{  width: '120px', ml: 1 }}>
                            <Link to='/seller/shops' style={{ textDecoration: 'none', color: 'black', fontWeight: '600' }}>
                                <Typography>My Shop</Typography>
                            </Link>
                        </MenuItem>)}
                        <MenuItem key={'allShops'} onClick={handleCloseNavMenu} sx={{  width: '120px', ml: 1 }}>
                            <Link to='/shops/all' style={{ textDecoration: 'none', color: 'black', fontWeight: '600' }}>
                                <Typography>All Shops</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem key={'myProfile'} onClick={handleCloseNavMenu} sx={{  width: '120px', ml: 1 }}>
                            <Link to={`/users/${authObj.user._id}`} style={{ textDecoration: 'none', color: 'black', fontWeight: '600' }}>
                                <Typography>My Profile</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem key={'logOut'} onClick={() => auth.clearJWT(() => handleCloseNavMenu())} sx={{  width: '120px', ml: 1 }}>
                            <Link to='/' style={{ textDecoration: 'none', color: 'black', fontWeight: '600' }}>
                                <Typography>Log Out</Typography>
                            </Link>
                        </MenuItem>
                    </Box>
                    : pages.map((page, idx) => (
                        <MenuItem key={idx} onClick={handleCloseNavMenu} sx={{  width: '120px', ml: 1 }}>
                            <Link to={page.link} style={{ textDecoration: 'none', color: 'black', fontWeight: '600' }} ><Typography>{page.page}</Typography></Link>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                <Typography component='a' href='/' 
                    sx={{
                        display: { display: 'flex', },
                        flexGrow: 1,
                        fontWeight: '600',
                        textDecoration: 'none',
                        color: 'white',
                        letterSpacing: '0.2rem'
                    }}>
                    MARKETPLACE
                </Typography>
                <Box sx={{ display: 'flex', flexGrow: 0, mr: 2 }}>
                    <Link to='/cart'>
                        <StyledBadge badgeContent={cart.length} color='tertiary'>
                            <AddShoppingCartIcon sx={{ color: 'white' }} />
                        </StyledBadge>
                    </Link>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>)
}

export default MobileMenu