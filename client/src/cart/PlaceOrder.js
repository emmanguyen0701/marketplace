import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import { Typography, Button, Box,
    DialogTitle, Dialog, 
} from '@mui/material'

import auth from '../auth/auth-helper'
import cartObj from './cart-helper'
import { useCart } from '../contexts/Cart'
import { createOrderAndCharge } from '../order/api-order'

const OrderComplete = ({ open, onClose, orderId }) => {
    const navigate = useNavigate()

    const handleClose = () => {
        onClose()
        navigate('/')
    }

    const handleGoToOrder = (id) => {
        onClose()
        navigate(`/orders/${id}`)
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ m: 'auto', p: '20px 30px' }}>Order Complete!</DialogTitle>
            <Box sx={{  m: 'auto', p: '0 30px 30px' }}>
                <Button sx={{ 
                    width: '120px',
                    height: '40px',
                    bgcolor: 'info.main',
                    color: 'info.contrastText',
                    borderRadius: '4px',
                    mr: '9px',
                    '&:hover': {bgcolor: 'info.hover'} }} 
                    onClick={() => handleGoToOrder(orderId)}>View Order</Button>
                <Button sx={{ 
                    width: '120px',
                    height: '40px',
                    bgcolor: 'tertiary.main',
                    color: 'tertiary.contrastText',
                    borderRadius: '4px',
                    '&:hover': {bgcolor: 'tertiary.hover'} }} 
                    onClick={handleClose}>Return Home</Button>
            </Box>
        </Dialog>
    )
}

const PlaceOrder = ({ checkoutDetails }) => {
    const { cart, onChangeCart } = useCart()
    const elements = useElements()
    const stripe = useStripe()
    const shopId = cart.length > 0 && cart[0].shop 

    const [values, setValues] = useState({
        orderId: '',
    })
    const [isProcessing, setIsProcessing] = useState(false)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)

    const authObj = auth.isAuthenticated()

    const handleSubmit = async (e) => {
        e.preventDefault()

        let cardElementComplete = document.querySelector('.StripeElement--complete')

        if (cardElementComplete === null) {
            setError("Card information is required")
            return
        }

        if (!stripe || !elements) {
            return // Stripe has not been loaded, do nothing.
        }
        setIsProcessing(true)

        const res = await createOrderAndCharge(
            { shopId: shopId, userId: authObj.user._id },
            { t: authObj.token },
            checkoutDetails
        )

        if (res && res.error) {
            setError(res.error)
        }
        const { client_secret } = res.paymentIntent

        const paymentResult = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: { name: checkoutDetails.customer_name },
            },
        })

        if (paymentResult.error) {
            setValues({ ...values, error: paymentResult.error.message })
        } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
                setIsProcessing(false)
                cartObj.emptyCart(() => {
                    //redirect users to My orders
                    setValues({ ...values, orderId: res.orderId })
                    setOpen(true)
                })
                onChangeCart([])
            }
        }
    }

    const handleClose = () => setOpen(false)

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <Typography sx={{ color: 'primary.main', fontSize: '18px', mb: '16px' }}>Card Details</Typography>
            <CardElement />
            <Button type='submit'
            sx={{ width: '120px', mt: '14px', mb: '10px', backgroundColor: 'info.main', color: 'white', '&:hover': { backgroundColor: 'info.hover' } }}
                >Place Order</Button>
            <Box>
                <Typography sx={{ fontSize: '10px' }}>Test card: 4242 4242 4242 4242</Typography>
                <Typography sx={{ fontSize: '10px' }}>Expired date: Any future date</Typography>
                <Typography sx={{ fontSize: '10px' }}>Zip: Any 5-digit number</Typography>
            </Box>
            {error &&
            <Typography sx={{ color: 'error.main' }}>{error}</Typography>}
        </form>
        {isProcessing && <Typography sx={{ color: 'info.main' }}>Processing...</Typography> }
        <OrderComplete orderId={values.orderId} open={open} onClose={handleClose} />
    </div>
    )
}

PlaceOrder.propTypes = {
    checkoutDetails: PropTypes.object.isRequired,
}

export default PlaceOrder