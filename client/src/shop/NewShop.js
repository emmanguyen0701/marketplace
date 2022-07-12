import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { TextField, Button,
    Card, CardContent, CardActions, 
    Typography, Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { createShop } from './api-shop'

const NewShop = () => {
    const [values, setValues] = useState({
        logo: '',
        name: '',
        description: '',
        error: '',
        redirectToShop: false,
    })

    const authObj = auth.isAuthenticated()

    const handleChange = (name) => (event) => {
        const inputValue = event.target.files ? event.target.files[0] : event.target.value
        setValues({ ...values, [name]: inputValue })
    }

    const handleSubmit = () => {
        const form = new FormData()
        form.append('logo', values.logo)
        form.append('name', values.name)
        form.append('description', values.description)

        const validationFailed =  !values.name || !values.description
        if (!values.logo) {
            setValues({ ...values, error: 'Image is required.' })
            return
        }
        if (validationFailed) {
            setValues({ ...values, error: 'Please fill in required fields' })
            return
        }
        createShop({ userId: authObj.user._id }, { t: authObj.token }, form)
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, redirectToShop: true })
            }
        })
    }

    if (values.redirectToShop) {
        return <Navigate to='/seller/shops' />
    }

    return (
    <Card sx={{ maxWidth: '600px', m: 'auto', mt: '20px' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
            <Typography variant='h5' sx={{ mb: '20px' }}>New Shop</Typography>
            {values.error && (
                <Typography sx={{ color: 'error.main', mb: '20px' }}>{values.error}</Typography>
            )}
            <Box sx={{ width: '65%', display: 'flex', justifyContent: 'space-around' }}>
                <label htmlFor='upload-logo-btn'>Upload Logo:</label>
                <input
                id='upload-logo-btn'
                type='file'
                accept='image/*'
                onChange={handleChange('logo')}
                />
            </Box>
            <TextField sx={{ width: '80%', mb: '30px', mt: '10px' }}
                required
                label='Name' variant='standard'
                name='name' 
                value={values.name}
                onChange={handleChange('name')}
            />
            <TextField multiline rows='2' sx={{ width: '80%' }}
                required
                label='Description' variant='standard'
                name='description'
                value={values.description}
                onChange={handleChange('description')}
            />
            <Box sx={{ width: '80%', display: 'flex', justifyContent: 'center', mt: '20px'  }}>
            <CardActions>
                <Button onClick={handleSubmit}
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', 'width': '80px', '&:hover': { bgcolor: '#b82727' } }}
                >Submit</Button>
            </CardActions>
            <CardActions>
                <Button sx={{ bgcolor: 'tertiary.main', color: 'tertiary.contrastText', width: '80px', '&:hover': { bgcolor: 'tertiary.hover' } }}
                >Cancel</Button>
            </CardActions>
            </Box>
        </CardContent>
    </Card>)
}

export default NewShop