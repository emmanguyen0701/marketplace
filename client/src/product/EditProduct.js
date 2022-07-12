import React, { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { TextField, Button,
    Card, CardContent, CardActions, 
    Typography, Box,
} from '@mui/material'


import auth from '../auth/auth-helper'
import { listProductDetail, updateProduct } from './api-product'

const EditProduct = () => {
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

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listProductDetail(signal, { productId: params.productId })
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, product: res })
            }
        })
        
        return () => controller.abort()
    }, [params.productId])

    const handleChange = name => event => {
        const inputValue = event.target.files ? event.target.files[0] : event.target.value
        setValues({ ...values, product: { ...values.product, [name]: inputValue } })
    }

    const handleSubmit = () => {
        const form = new FormData()
        if (values.product.image) {
            form.append('image', values.product.image)
        }
        const description = values.product.description || ''
        const category = values.product.category || ''
        form.append('name', values.product.name)
        form.append('description', description)
        form.append('category', category)
        form.append('quantity', values.product.quantity)
        form.append('price', values.product.price)
        const validationFailed =  !values.product.name || !values.product.quantity || !values.product.price
        if (validationFailed) {
            setValues({ ...values, error: 'Please fill in required fields' })
            return
        }
        updateProduct({ shopId: params.shopId }, { productId: params.productId }, 
            { t: authObj.token }, form)
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
            <Typography variant='h5' sx={{ mb: '10px' }}>Update Product</Typography>
                {values.error && (
                    <Typography sx={{ color: 'error.main', mb: '12px' }}>{values.error}</Typography>
                )}
            <Box sx={{ width: '65%', display: 'flex', justifyContent: 'space-around' }}>
                <label htmlFor='upload-image-btn'>Edit Image:</label>
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
                    >Update</Button>
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

export default EditProduct