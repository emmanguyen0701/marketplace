import React from 'react'
import { useParams } from 'react-router-dom'

import PropTypes from 'prop-types'

import { Dialog, DialogTitle, 
    List, ListItem, Button
} from '@mui/material'

import { deleteUser } from './api-user'
import auth from '../auth/auth-helper'

const DeleteProfile = ({ open, onClose }) => {
    const params = useParams()

    const authObj = auth.isAuthenticated()

    const handleClose = () => {
        onClose()
    }

    const handleDeleteUser = () => {
        deleteUser({ userId: params.userId }, { t: authObj.token })
        .then(res => {
            if (res && res.error) {
                console.log(res.error)
            } else {
                auth.clearJWT(() => handleClose())
            }
        })
    }

    return (
    <Dialog open={open} onClose={handleClose} 
        sx={{ '& .MuiDialog-paper': { 
            height: '160px',
            display: 'flex',
            justifyContent: 'space-around'
        }}}
    >
        <DialogTitle sx={{ color: 'warning.main', textAlign: 'center' }}>Delete the account?</DialogTitle>
        <List sx={{ display: 'flex', justifyContent: 'center'}}>
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
                onClick={handleDeleteUser}>Delete</Button>
            </ListItem>
        </List>
    </Dialog>
    )
}

DeleteProfile.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

export default DeleteProfile