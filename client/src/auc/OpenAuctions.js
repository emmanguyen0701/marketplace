import React, { useState, useEffect } from 'react'

import { Paper,
    Typography,
} from '@mui/material'

import { getAllAuctions } from './api-auction'
import Auctions from './Auctions'

const OpenAuctions = () => {
    const [auctions, setAuctions] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getAllAuctions(signal).then(res => {
            setAuctions(res)
        })

        return () => controller.abort()
    })

    return (
    <Paper sx={{ paddingTop: '20px' }}>
        <Typography variant='h5' sx={{ textAlign: 'center', color: 'secondary.main' }}>ALL AUCTIONS</Typography>
        <Auctions auctions={auctions} />
    </Paper>)
}

export default OpenAuctions