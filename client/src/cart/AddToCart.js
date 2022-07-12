import React, { useState, } from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { DialogTitle, Dialog,
    Button, Box,
} from '@mui/material'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

import cartObj from './cart-helper'
import { useCart } from '../contexts/Cart'

const StartNewItemDialog = ({ open, onClose, item }) => {
    const { onChangeCart } = useCart()
    const [redirect, setRedirect] = useState(false)
    
    const handleClose = () => onClose()

    const handleStartNewCart = (itemToAdd) => {
        cartObj.emptyCart(() => {
            const newCart = cartObj.addItem(itemToAdd)
            onChangeCart(newCart)
            onClose()
            setRedirect(true)
        })
    }

    if (redirect) {
        return <Navigate to='/cart' />
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth={true}>
            <DialogTitle sx={{ m: 'auto', pt: '22px', pb: '20px' }}>Start New Cart?</DialogTitle>
            <Box sx={{  m: 'auto', pb: '26px' }}>
                <Button sx={{ 
                    width: '120px',
                    height: '40px',
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    borderRadius: '4px',
                    mr: '9px',
                    '&:hover': {bgcolor: '#991f1f'} }} 
                    onClick={() => handleStartNewCart(item)}>Yes</Button>
                <Button sx={{ 
                    width: '120px',
                    height: '40px',
                    bgcolor: 'tertiary.main',
                    color: 'tertiary.contrastText',
                    borderRadius: '4px',
                    '&:hover': {bgcolor: 'tertiary.hover'} }} 
                    onClick={handleClose}>Cancel</Button>
            </Box>
        </Dialog>
    )
}

const AddToCart = ({ item }) => {
    const [redirectToCart, setRedirectToCart] = useState(false)
    const [open, setOpen] = useState(false)

    const { cart, onChangeCart } = useCart()
    
    const addItemToCart = (item) => {
        const updatedCart = cartObj.addItem(item)
        onChangeCart(updatedCart)
        setRedirectToCart(true)
    }

    const handleAddCart = (item) => {
        const itemSameShop = cart.every(product => product.shop === item.shop._id)
        if (!itemSameShop) {
            setOpen(true)
        } else {
            addItemToCart(item)
        }
    }

    const handleClose = () => setOpen(false)

    if (redirectToCart) {
        return <Navigate to='/cart' />
    }

    return (
    <div>    
        <AddShoppingCartIcon 
            sx={{ color: 'info.main', m: '5px 10px 10px 10px', '&:hover': { color: '#1e9e31', cursor: 'pointer' } }} 
            onClick={() => handleAddCart(item)}
        />
        <StartNewItemDialog 
        open={open} 
        onClose={handleClose}
        item={item}
        addItemToCart={addItemToCart}
        />
    </div>
    )
}

AddToCart.propTypes = {
    item: PropTypes.object.isRequired,
}

export default AddToCart