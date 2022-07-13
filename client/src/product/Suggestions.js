import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Box, Card, CardContent, 
    CardMedia, CardActions, 
    Typography, Grid,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

import AddToCart from '../cart/AddToCart'
import useWindowDimension from '../hook/useWindowDimension'

const Suggestions = ({ products, title }) => {
    const navigate = useNavigate()
    const [autoMargin, setAutoMargin] = useState(0)
    const isMobile = useWindowDimension() <= 860

    useEffect(() => {
        if (isMobile) {
            setAutoMargin('auto')
        } else {
            setAutoMargin(0)
        }
    }, [isMobile])

    return (
    <Box sx={{ pl: !isMobile ? '64px' : 0 }}>
        <Typography variant='h6' sx={{ mb: '12px', mt: '12px', fontWeight: '600'  }}>{title}</Typography>
        <Grid container spacing={1}>
            {products && products.length > 0 && products.map((product, idx) => (
                <Grid key={idx} item sx={{ m: autoMargin }}>
                    <Card sx={{ width: '280px', height: '260px', borderRadius: '2px' }}>
                        <CardMedia 
                            component='img'
                            alt={product.name}
                            sx={{ objectFit: 'contain', m: 'auto', height: '170px', width: 'auto' }}
                            image={`/api/products/image/${product._id}`}
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
                                <AddToCart item={product} />
                            </CardActions>
                        </Box>
                    </Card> 
                </Grid>
            ))}
        </Grid>
    </Box>

    )
}

Suggestions.propTypes = {
    products: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
}

export default Suggestions