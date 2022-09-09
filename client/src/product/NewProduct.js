import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { TextField, Button,
    Card, CardContent, CardActions, 
    Typography, Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { createProduct } from './api-product'

const NewProduct = () => {
    const [values, setValues] = useState({
        product: {
            image: '',
            name: '',
            description: '',
            category: '',
            quantity: '',
            price: '',
        },
        error: '',
        redirectToShop: false,
    })
    const params = useParams()
    const authObj = auth.isAuthenticated()

    const handleChange = name => event => {
        const inputValue = event.target.files ? event.target.files[0] : event.target.value
        setValues({ ...values, product: { ...values.product, [name]: inputValue } })
    }

    const handleSubmit = () => {
        const form = new FormData()
        const description = values.product.description || ''
        const category = values.product.category || ''
        form.append('image', values.product.image)
        form.append('name', values.product.name)
        form.append('description', description)
        form.append('category', category)
        form.append('quantity', values.product.quantity)
        form.append('price', values.product.price)
        const validationFailed =  !values.product.name || !values.product.quantity || !values.product.price
        if (!values.product.image) {
            setValues({ ...values, error: 'Image is required.' })
            return
        }
        if (validationFailed) {
            setValues({ ...values, error: 'Please fill in required fields' })
            return
        }
        createProduct({ shopId: params.shopId }, { t: authObj.token }, form)
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, redirectToShop: true })
            }
        })
    }

    if (values.redirectToShop) {
        return <Navigate to={`/shops/${params.shopId}`} />
    }

    return (
    <Card sx={{ maxWidth: '600px', m: 'auto', mt: '20px' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
            <Typography variant='h5' sx={{ mb: '10px' }}>New Product</Typography>
                {values.error && (
                    <Typography sx={{ color: 'error.main', mb: '12px' }}>{values.error}</Typography>
                )}
            <Box sx={{ width: '65%', display: 'flex', justifyContent: 'space-around' }}>
                <label htmlFor='upload-image-btn'>Upload Image:</label>
                <input required
                id='upload-image-btn'
                type='file'
                accept='image/*'
                onChange={handleChange('image')}
                />
            </Box>
            <TextField sx={{ width: '80%', mb: '16px', mt: '10px' }}
                required
                label='Name' variant='standard'
                name='name' 
                value={values.product.name}
                onChange={handleChange('name')}
            />
            <TextField multiline rows='2' sx={{ width: '80%', mb: '16px' }}
                label='Description' variant='standard'
                name='description'
                value={values.product.description}
                onChange={handleChange('description')}
            />
            <TextField sx={{ width: '80%', mb: '16px' }}
                label='Category' variant='standard'
                name='category'
                value={values.product.category}
                onChange={handleChange('category')}
            />
            <TextField sx={{ width: '80%', mb: '16px' }}
                required
                label='Quantity' variant='standard'
                name='quantity'
                type='number' 
                value={values.product.quantity = !!values.product.quantity && Math.abs(values.product.quantity) >= 0 ? Math.abs(values.product.quantity) : undefined || ''}
                onChange={handleChange('quantity')}
            />            
            <TextField sx={{ width: '80%', mb: '16px' }}
                required
                label='Price' variant='standard'
                name='price'
                type='number'
                value={values.product.price = !!values.product.price && Math.abs(values.product.price) >= 0 ? Math.abs(values.product.price) : undefined || ''}
                onChange={handleChange('price')}
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
    </Card>
    )
}

export default NewProduct