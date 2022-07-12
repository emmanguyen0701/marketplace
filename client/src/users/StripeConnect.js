import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'

import { Paper, Typography, Box, } from '@mui/material'

import auth from '../auth/auth-helper'
import { stripeUpdate } from './api-user'

const StripeConnect = () => {
    const location = useLocation()

    const [values, setValues] = useState({
        error: false,
        connecting: false,
        connected: false,
    })
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        const parsed = queryString.parse(location?.search) // location.search: '?foo=bar'
        if (parsed.error) {
            setValues({ ...values, error: true })
        }
        if (parsed.code) {
            setValues({ ...values, connecting: true })
            // POST call to Stripe, get credentials and update user's data
            stripeUpdate({ userId: authObj.user._id }, { t: authObj.token }, parsed.code, signal)
            .then(res => {
                if (res && res.error) {
                    setValues({ ...values, error: true })
                } else {
                    auth.updateJWT(res, () => {
                        setValues({ ...values, connected: true })
                    })
                }
            })
        }

        return () => controller.abort()
    }, [])

    return (
    <Paper sx={{ height: '400px', pl: '10px' }}>
        <Typography variant='h5' sx={{ color: 'info.main', pt: '20px' }}>Connect Your Stripe Account</Typography>
        <Box sx={{ mt: '26px', }}>
            {values.error && 
            <Typography sx={{ color: 'error.main' }}>Couldn't connect to your Stripe account. Please try again.</Typography>}
            {values.connecting && 
            <Typography>Connecting to your Stripe account...</Typography>}
            {values.connected && 
            <Typography>Connect to your Stripe account succesfull!</Typography>}
        </Box>
    </Paper>
    )
}

export default StripeConnect