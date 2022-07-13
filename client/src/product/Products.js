import React, { useState, useEffect } from 'react'
import { useNavigate,  } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Typography, Box, Card, Grid,
    CardMedia, CardContent, CardActions,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

import AddToCart from '../cart/AddToCart'
import useWindowDimension from '../hook/useWindowDimension'

const Products = ({ products, searched }) => {
    const navigate = useNavigate()
    const isMobile = useWindowDimension() <= 860
    const [autoMargin, setAutoMargin] = useState(0)

    useEffect(() => {
        if (isMobile) {
            setAutoMargin('auto')
        } else {
            setAutoMargin(0)
        }
    }, [isMobile])

    return (
    <Box sx={{ pl: !isMobile ? '64px' : 0 }}>
        {products.length > 0
        ? (<Grid container spacing={2} rowSpacing={1}>
            {products.map((product, idx) => (
                <Grid item key={idx} sx={{ m: autoMargin }}>
                    <Card sx={{  width: '280px', height: '260px', borderRadius: '2px' }} variant='outlined'>
                        <CardMedia 
                            component='img'
                            alt={product.name}
                            image={`/api/products/image/${product._id}`}
                            sx={{ objectFit: 'contain', m: 'auto', height: '170px', width: 'auto' }}
                        /> 
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <CardContent sx={{ width: '100%', pt: '10px'}}>
                                <Typography sx={{ fontSize: '17px', color: 'tertiary.contrastText' }}>{product.name}</Typography>
                                <Typography sx={{ fontSize: '15px', mt: '5px', fontWeight: '600' }}>${product.price}</Typography>
                            </CardContent>   
                            <CardActions>
                                <VisibilityIcon 
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    sx={{ color: 'info.main', m: '5px 20px 10px 10px', '&:hover': { color: '#1e9e31', cursor: 'pointer' } }}/>
                                { product.quantity > 0 && (<AddToCart item={product} />) } 
                            </CardActions>
                        </Box>
                    </Card>                    
                </Grid>
            ))}
        </Grid>)
        : ((<Typography variant='h6' sx={{ ml: '20px', pb: '16px' }}>No Products Found.</Typography>))
        }
    </Box>)
}

Products.propTypes = {
    products: PropTypes.array.isRequired,
    searched: PropTypes.bool.isRequired,
}

export default Products