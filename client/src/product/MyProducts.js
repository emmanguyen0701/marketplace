import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Typography, Box, Card, Grid,
    Button, Divider, CardMedia,
 } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import DeleteProduct from './DeleteProduct'
import useWindowDimension from '../hook/useWindowDimension'

const MyProducts = ({ products, updateProducts }) => {
    const params = useParams()
    const navigate = useNavigate()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState({})
    const windowDimension = useWindowDimension()
    const [autoMargin, setAutoMargin] = useState(0)
    
    useEffect(() => {
        if (windowDimension <= 860) {
            setAutoMargin('auto')
        } else {
            setAutoMargin(0)
        }
    }, [windowDimension])

    const handleDeleteOpen = item => {
        setDeleteOpen(true)
        setProductToDelete(item)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
    }

    return (
    <Grid container spacing={1} rowSpacing={1}>
        {products.map((product, idx) => (
            <Grid item key={idx}  sx={{ m: autoMargin }}>
                <Card sx={{ maxWidth: '380px', height: '200px', borderRadius: '1px', display: 'flex' }} 
                variant='outlined'>
                    <CardMedia 
                        component='img'
                        alt={product.name}
                        sx={{ objectFit: 'cover', width: '140px', mr: '40px', }}
                        image={`/api/product/image/${product?._id}`}
                    />
                    <Box sx={{ width: '280px' }}>
                        <Typography sx={{ mt: '20px' }} variant='h6'>{product.name}</Typography>
                        <Box sx={{ mt: '14px', display: 'flex', width: '84%', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '15px' }}>Quantity: {product.quantity}</Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography sx={{ fontSize: '15px' }}>Price: ${product.price}</Typography>
                        </Box>
                        <Box sx={{ mt: '22px' }}>
                            <Button 
                            onClick={() => navigate(`/seller/${params.shopId}/${product._id}/edit`)}
                            sx={{ color: 'secondary.main' }}>
                                <EditIcon  />
                            </Button>
                            <Button sx={{ ml: '10px' }} onClick={() => handleDeleteOpen(product)}>
                                <DeleteIcon />
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        ))}
        <DeleteProduct 
        open={deleteOpen}
        onClose={handleDeleteClose}
        product={productToDelete}
        onDeleteProduct={updateProducts}
        />
    </Grid>)
}

MyProducts.propTypes = {
    products: PropTypes.array.isRequired
}

export default MyProducts