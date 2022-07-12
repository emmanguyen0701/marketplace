import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Dialog, DialogTitle, 
    List, ListItem, Button
} from '@mui/material'

import auth from './../auth/auth-helper'
import { deleteProduct } from './api-product'

const DeleteProduct = ({ open, onClose, product, onDeleteProduct }) => {
    console.log("From delete product", product)
    const authObj = auth.isAuthenticated()
    const params = useParams()

    const handleClose = () => onClose()
    
    const handleDelete = () => {
        deleteProduct({ shopId: params.shopId }, 
            { productId: product._id }, 
            { t: authObj.token })
        .then(res => {
            if (res && res.error) {
                console.log(res.error)
            } else {
                onDeleteProduct(product)
                handleClose()
            }
        })
    }

    return (
    <Dialog open={open} onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { 
            height: '160px',
            display: 'flex',
            justifyContent: 'space-around' }
            }}>
        <DialogTitle sx={{ color: 'warning.main', textAlign: 'center' }}> Delete {product.name}?</DialogTitle>
        <List sx={{ display: 'flex', justifyContent: 'center'}}>
            <ListItem sx={{ justifyContent: 'center', }}> 
                <Button sx={{ 
                    bgcolor: 'error.main', 
                    color: 'warning.contrastText',
                    height: '42px',
                    borderRadius: '4px',
                    width: '110px',
                    '&:hover': {
                        bgcolor: '#991f1f'
                    }
                }} variant='contained'
                onClick={handleDelete}>Delete</Button>
            </ListItem>
            <ListItem sx={{ justifyContent: 'center', }}>
                <Button sx={{
                    bgcolor: 'tertiary.main',
                    color: 'tertiary.contrastText',
                    height: '42px',
                    borderRadius: '4px',
                    width: '110px',
                    '&:hover': {
                        bgcolor: 'tertiary.hover'
                    }
                }} onClick={handleClose}>Cancel</Button>
            </ListItem>
        </List>
    </Dialog>
    )
}

DeleteProduct.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    product: PropTypes.object.isRequired,
    onDeleteProduct: PropTypes.func.isRequired,
}

export default DeleteProduct