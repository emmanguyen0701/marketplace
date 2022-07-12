import React from 'react'
import PropTypes from 'prop-types'

import { Dialog, DialogTitle, 
    List, ListItem, Button
} from '@mui/material'

import auth from './../auth/auth-helper'
import { deleteShop } from './api-shop'

const DeleteShop = ({ open, onClose, shop, onDeleteShop }) => {
    const authObj = auth.isAuthenticated()

    const handleClose = () => {
        onClose()
    }

    const handleDelete = () => {
        deleteShop({ shopId: shop._id }, { t: authObj.token })
        .then(res => {
            if (res && res.error) {
                console.log(res.error)
            } else {
                onDeleteShop(shop)
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
        <DialogTitle sx={{ color: 'warning.main', textAlign: 'center' }}> Delete Shop?</DialogTitle>
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

DeleteShop.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    shop: PropTypes.object.isRequired,
    onDeleteShop: PropTypes.func.isRequired,
}

export default DeleteShop