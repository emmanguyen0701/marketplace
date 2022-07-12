import React from 'react'
import { useNavigate, Link, useLocation, } from 'react-router-dom'

import { Card, CardMedia, Button,
    CardActions, TextField,
    Typography, Box, 
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import auth from '../auth/auth-helper'
import { capitalizeFirstLetter } from '../utils/helperFunctions'
import { useCart } from '../contexts/Cart'
import cartObj from './cart-helper'

const CartItems = ({showCheckout }) => {
    const authObj = auth.isAuthenticated()
    const navigate = useNavigate()
    const { cart, onChangeCart } = useCart()
    
    const handleQuantityChange = (index) => (event) => {
        let updatedCart = [...cart]
        updatedCart = cartObj.updateCart(index, event.target.value)
        onChangeCart(updatedCart)
    }
    
    const getTotal = () => {
        const total = cart.reduce((prev, curr) => {
            return prev + curr.product.price * Number(curr.quantity)
        }, 0)
        return parseFloat(total).toFixed(2)
    }

    const removeItem = (idx) => {
        let updatedCart = [...cart]
        updatedCart = cartObj.removeItemFromCart(idx)
        onChangeCart(updatedCart)  
    }

    const openCheckout = () => {
        showCheckout(true)
    }

    return (
    <Card sx={{ width: '60%', minWidth: '370px', m: 'auto', pt: '20px', borderRadius: '2px' }}>
        <Typography variant='h5' sx={{ textAlign: 'center', mb: '16px', fontWeight: '600' }}>Your Cart</Typography>
        { cart.length > 0 
        ? cart.map((item, idx) => (
                <Card elevation={0} variant='outlined' key={idx} sx={{ display: 'flex', borderRadius: '1px', m: '3px 7px' }}>
                    <CardMedia 
                        component='img'
                        alt={item.product.name}
                        image={`/api/product/image/${item.product._id}`}
                        sx={{ objectFit: 'contain', height: '170px', width: '40%' }}
                    />
                    <Box sx={{ width: '60%', pl: '30px' }}> 
                        <Typography sx={{ fontSize: '18px', pt: '10px' }}>{capitalizeFirstLetter(item.product.name)}</Typography>
                        <Typography sx={{ fontSize: '16px', pt: '6px' }}>${item.product.price} x {Math.abs(item.quantity)}</Typography>
                        <Typography sx={{ fontSize: '15px', fontWeight: '600', pt: '6px',  }}>
                            <Link to={`/shops/${item.product.shop._id}`} style={{ color: '#2c37c9' }}>
                                {item.product.shop.name}
                            </Link>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <TextField variant="standard" id="outlined-number"
                            label="Quantity"
                            type="number"
                            inputProps={{
                                min: '1',
                            }}
                            value={item.quantity = !!item.quantity && Math.abs(item.quantity) >= 0 ? Math.abs(item.quantity) : undefined || ''}
                            disabled={item?.quantity > item?.product.quantity}
                            onChange={handleQuantityChange(idx)}
                            sx={{ mt: '10px', maxWidth: '100px' }}
                            />
                            <Button onClick={() => removeItem(idx)}
                            ><CloseIcon sx={{ color: 'primary.main', fontSize: '20px', pr: '3px' }}/> Remove</Button>
                        </Box>
                    </Box>
                </Card>)
            )
        : <Typography sx={{ ml: '20px' }} variant='h6'>Your Cart Is Empty</Typography>
        }
        <Box sx={{ mt: '14px', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography sx={{ fontWeight: '600', fontSize: '21px' }}>Total: ${getTotal()}</Typography>
            <CardActions sx={{ pr: '0', mt: '6px' }}>
                {!authObj 
                ? <Button sx={{ bgcolor: 'primary.main', color: 'white',  '&:hover': { bgcolor: 'primary.hover' }}}
                onClick={() => navigate('/signin', {state: { from: '/cart' }})}>Sign in to checkout</Button>
                : <Button sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.hover' }}}
                    onClick={openCheckout}
                    disabled={cart.length === 0}
                    >
                    Check out
                </Button>
                }
                <Button sx={{ ml: '0', bgcolor: 'info.main', color: 'white', '&:hover': { bgcolor: 'info.hover'} }}
                    onClick={() => navigate('/')}
                >Continue Shopping
                </Button>
            </CardActions>
        </Box>
    </Card>
    )
}

export default CartItems