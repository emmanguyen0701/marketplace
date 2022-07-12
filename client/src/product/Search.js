import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Card, Box, TextField, MenuItem, 
    Button, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { getProducts } from './api-product.js'
import Products from './Products.js'
import { capitalizeFirstLetter } from '../utils/helperFunctions'

const Search = ({ categories }) => {
    const [values, setValues] = useState({
        search: '',
        category: '',
        error: '',
        results: [],
        searched: false,
    })

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = () => {
        getProducts({ category: values.category, search: values.search })
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, results: res, searched: true, })
            }
        })
    }

    return (
    <Card sx={{ pt: '26px', pb: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: '20px', width: '100%' }}>
            <TextField sx={{ width: '260px', mr: '10px' }}
                id='outlined-select-category'
                select
                label='Select a product category'
                value={values.category}
                onChange={handleChange('category')}
            >
                <MenuItem value='all'>All</MenuItem>
                {categories.map((category, idx) => (
                    <MenuItem key={idx} value={category}>
                        {capitalizeFirstLetter(category)}
                </MenuItem>))}
            </TextField>
            <br/>
            <TextField sx={{ width: '400px', mr: '10px' }}
                label='Search products' variant='outlined'
                name='search' value={values.search}
                onKeyPress={handleKeyPress}
                onChange={handleChange('search')} 
            />
            <Button onClick={handleSearch}
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': {
                    bgcolor: 'cc2d2d'
                }}}
                ><SearchIcon sx={{ fontSize: '24px' }} />
            </Button>
        </Box>
        <Box sx={{ ml: '20px' }}>
            { values.searched && <Products products={values.results} searched={values.searched} />}
            
        </Box>
    </Card>
    )
}

Search.propTypes = {
    categories: PropTypes.array.isRequired,
}

export default Search