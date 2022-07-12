import React, { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { Typography, TextField, Card,
     Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import PlaceOrder from './PlaceOrder'
import { useCart } from '../contexts/Cart'

const CheckoutForm = () => {
    const { cart } = useCart()
    const user = auth.isAuthenticated().user

    const [values, setValues] = useState({
        checkoutDetails: {
            customer_name: user.name,
            customer_email: user.email,
            delivery_address: {
                street: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
            },
            products: cart,
        },
        error: '',
    })


    const handleCheckoutDetailsChange = (name) => (event) => {
        let checkoutDetails = values.checkoutDetails
        checkoutDetails[name] = event.target.value || ''
        setValues({ ...values, checkoutDetails })
    }

    const handleDeliveryAddressChange = (name) => (event) => {
        let checkoutDetails = values.checkoutDetails
        checkoutDetails.delivery_address[name] = event.target.value || ''
        setValues({ ...values, checkoutDetails })
    }

    return (
    <Card sx={{        
    maxWidth: '600px',
    minWidth: '380px',
    m: '26px auto 30px',
    textAlign: 'center',
    pb: '20px',
    }}>
        <Typography variant='h5' sx={{ pt: '20px', pb: '20px', color: 'primary.main' }}>Checkout</Typography>
        <Box sx={{ width: '500px', m: 'auto' }}>
            <TextField sx={{ width: '80%', mb: '20px' }}
            variant='standard' type='text'
            label='Name' name='customer_name'
            value={values.checkoutDetails.customer_name}
            onChange={handleCheckoutDetailsChange('customer_name')}
            />
            <TextField sx={{ width: '80%', mb: '20px' }}
            variant='standard' type='text'
            label='Email' name='customer_email'
            value={values.checkoutDetails.customer_email}
            onChange={handleCheckoutDetailsChange('customer_email')}
            />
        </Box>
        <Typography sx={{ fontSize: '18px', color: 'primary.main' }}>Delivery Details</Typography>
        <Box sx={{ width: '500px', m: 'auto' }}>
            <TextField sx={{ width: '80%', mb: '20px' }}
            variant='standard' type='text'
            label='Street' name='street'
            value={values.checkoutDetails.delivery_address.street}
            onChange={handleDeliveryAddressChange('street')}
            />        
            <TextField sx={{ width: '40%', mb: '20px', pr: '10px' }}
            variant='standard' type='text'
            label='City' name='city'
            value={values.checkoutDetails.delivery_address.city}
            onChange={handleDeliveryAddressChange('city')}
            />
            <TextField sx={{ width: '40%', mb: '20px' }}
            variant='standard' type='text'
            label='State' name='state'
            value={values.checkoutDetails.delivery_address.state}
            onChange={handleDeliveryAddressChange('state')}
            />       
            <TextField sx={{ width: '40%', mb: '20px', pr: '10px' }}
            variant='standard' type='text'
            label='Country' name='country'
            value={values.checkoutDetails.delivery_address.country}
            onChange={handleDeliveryAddressChange('country')}
            />
            <TextField sx={{ width: '40%', mb: '20px' }}
            variant='standard' type='text'
            label='Zipcode' name='zipcode'
            value={values.checkoutDetails.delivery_address.zipcode}
            onChange={handleDeliveryAddressChange('zipcode')}
            />
        </Box>
        {values.error &&
        <Typography sx={{ color: 'error.primary' }}>{values.error}</Typography>}
        <Box sx={{ width: '400px', m: 'auto' }}>
            <PlaceOrder checkoutDetails={values.checkoutDetails} />
        </Box>

    </Card>
    )
}

export default CheckoutForm