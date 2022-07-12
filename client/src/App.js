import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { ThemeProvider } from '@mui/material'   
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { CssBaseline } from "@mui/material"

import theme from './theme'
import MainRouter from './MainRouter'


const App = () => {
    const [stripePromise, setStripePromise] = useState(() => loadStripe('pk_test_51J0SNdHFm3gAbbLySf3OAFp5SuJ0DAAoygeiXD9zlUmLQDfLgnAsdDluYdrEmgjth1SkUUjpn6hwPJgFs53RbNQs00YFPPvBlR'))
    
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                    <MainRouter />
                </Elements>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default hot(module)(App)