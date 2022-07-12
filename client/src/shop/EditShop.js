import React, { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'

import { TextField, Button,
    Card, CardContent, CardActions, 
    Typography, Box, Avatar, Grid,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { listShopDetail, updateShop } from './api-shop'
import { getProductsByShop } from '../product/api-product'
import MyProducts from '../product/MyProducts'

const EditShop = () => {
    const [values, setValues] = useState({
        shop: {
            logo: '',
            name: '',
            description: '',
        },
        error: '',
        redirectToMyShop: false,
    })
    const [products, setProducts] = useState([])

    const params = useParams()
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listShopDetail(signal, { shopId: params.shopId })
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, shop: res })
            }
        })
        getProductsByShop(signal, { shopId: params.shopId })
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setProducts(res)
            }
        })

        return () => controller.abort()
    }, [params.shopId])

    const handleChange = name => event => {
        const inputType = event.target.files ? event.target.files[0] : event.target.value 
        setValues({ ...values, shop: { ...values.shop, [name]: inputType } })
    }

    const handleSubmit = () => {
        const form = new FormData()
        if (values.shop.logo) {
            form.append('logo', values.shop.logo)
        }
        form.append('name', values.shop.name)
        form.append('description', values.shop.description)
        updateShop({ shopId: params.shopId },{ t: authObj.token }, form)
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, redirectToMyShop: true })
            }
        })
    }

    const updateProducts = (product) => {
        const updatedProducts = [ ...products ]
        const index = updatedProducts.indexOf(product)
        updatedProducts.splice(index, 1)
        setProducts(updatedProducts)
    }

    if (values.redirectToMyShop) {
        return <Navigate to='/seller/shops' />
    }

    return (
    <Grid container spacing={1}>
        <Grid item sm={12} md={4} sx={{ m: '0 auto'}}>
            <Card sx={{ minWidth: '340px', }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
                    <Typography variant='h5' sx={{ mb: '20px' }}>Edit Shop</Typography>
                    {values.error && (
                        <Typography sx={{ color: 'error.main' }}>{values.error}</Typography>
                    )}
                    {values.shop._id && (
                        <Avatar sx={{ width: 60, height: 60, mb: '20px' }}
                        src={`/api/shops/logo/${values.shop._id}?${new Date().getTime()}`} />
                    )}               
                    <label style={{ width: '90%', textAlign: 'center' }} htmlFor='upload-logo-btn'>
                        <Typography variant='subtitle' sx={{ color: 'primary.main', pr: '4px' }}>Edit Logo:</Typography>
                        <input
                        id='upload-logo-btn'
                        type='file'
                        accept='image/*'
                        onChange={handleChange('logo')}/>    
                    </label>
                    <TextField sx={{ width: '90%', mb: '30px', mt: '10px' }}
                        label='Name' variant='standard'
                        name='name' 
                        value={values.shop.name}
                        onChange={handleChange('name')}
                    />
                    <TextField multiline rows='2' sx={{ width: '90%' }}
                        label='Description' variant='standard'
                        name='description'
                        value={values.shop.description}
                        onChange={handleChange('description')}
                    />
                    <Box sx={{ width: '90%', display: 'flex', justifyContent: 'center', mt: '20px'  }}>
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
        </Grid>
        <Grid item sm={12} md={8} sx={{ m: '0 auto'}}>
            <Card sx={{  minWidth: '340px', }}>   
                <Box sx={{ display: 'flex', m: '18px auto', justifyContent: 'space-around', width: '360px' }}>
                    <Typography variant='h5'>Your Products</Typography>
                    {values.shop.owner?._id === authObj?.user._id && (
                        <Link to={`/seller/${values.shop._id}/products/new`}>
                            <Button sx={{ bgcolor: 'secondary.main', color: 'primary.contrastText', '&:hover': { bgcolor: '#2730b0' } }}
                            >ADD NEW PRODUCT</Button>
                        </Link>    
                    )}
                </Box>
                <MyProducts products={products} updateProducts={updateProducts} />
            </Card>
        </Grid>
    </Grid>)
}

export default EditShop