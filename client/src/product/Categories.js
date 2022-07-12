import React, { useEffect, useState, } from 'react'
import PropTypes from 'prop-types'

import { Grid, Typography, Box,
    Divider,
} from '@mui/material'

import { getProducts } from './api-product.js'
import { capitalizeFirstLetter } from '../utils/helperFunctions'
import Products from './Products'

const Categories = ({ categories }) => {
    const [selected, setSelected] = useState(categories[0])
    const [products, setProducts] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        getProducts({ category: categories[0] })
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setProducts(res)
            }
        })
    }, [])

    const handleSelectedCategory = category => event => {
        setSelected(category)
        getProducts({ category: category })
        .then(res => {
            if (res && res.error) {
                setError(res.error)
            } else {
                setProducts(res)
            }
        })
    }

    return (
    <Box>
        <Typography variant='h6' sx={{ p: '20px 0 20px 60px', fontWeight: '600' }}>Explore by Category</Typography>
        <Grid container  sx={{ 
            overflowX: 'auto',
            overFlowY: 'hidden',
            flexWrap: 'nowrap',
            maxWidth: '100%',
            }}>
            {categories.map((category, idx) => (
                <Grid item key={idx} 
                    sx={{ minWidth: '140px', width: '200px', height: '60px', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center',
                    bgcolor: selected == category ? 'tertiary.main' : 'white' , 
                    '&:hover': {
                        cursor: 'pointer',
                    }
                    }}
                    onClick={handleSelectedCategory(category)}>
                    <Box sx={{ fontSize: '18px', textAlign: 'center',}}
                    >{capitalizeFirstLetter(category)}
                    </Box>
                </Grid>
            ))}
        </Grid>
        <Divider />
        <Products products={products} searched={false} />
    </Box>
    )
}

Categories.propTypes = {
    categories: PropTypes.array.isRequired,
}

export default Categories