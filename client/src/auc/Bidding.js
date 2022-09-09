import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

import { Box, TextField,
    Button, Grid,
    Typography, 
} from '@mui/material'

import auth from '../auth/auth-helper'

const socket = io()

const Bidding = ({ auction, justEnd, updateBids }) => {
    const [bid, setBid] = useState(0)
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        socket.emit('join auction room', { room: auction._id })

        //clean up function
        return () => {
            socket.emit('leave auction room', { room: auction._id })
        }
    }, [])
    
    useEffect(() => {
        // constantly listen to the new bid event and update bids array
        socket.on('new bid', (payload) => {
            // update the bids array
            updateBids(payload)
        })

        return () => {
            socket.off('new bid')
        }
    })

    const minBid = auction.bids && 
                auction.bids.length > 0 ? auction.bids[0].bid : auction.startingBid

    const handleBidChange = (event) => {
        setBid(event.target.value)
    }

    const placeBid = () => {
        let user = authObj.user
        let newBid = {
            bidder: user,
            bid: bid,
            date: new Date()
        }
        socket.emit('new bid', {
            newBidInfo: newBid,
            roomId: auction._id
        })
        setBid(0)
    }

    return (
    <Box sx={{ mt: '20px' }}>{!justEnd && new Date() < new Date(auction.bidEnd) &&
        <Box>
            <TextField label='Your Bid ($)' 
            type='number' 
            helperText={`Min bid to be placed: $${Number(minBid)}` + `.5`}
            value={bid} onChange={handleBidChange}
            />
            <Button variant='contain' sx={{ color: 'secondary.main' }}
            disabled={bid < minBid}
            onClick={placeBid}
            >Place Bid</Button>
        </Box>}
        <Box>
            <Typography variant='h6' sx={{ }}>All Bids</Typography>
            <Grid container spacing={4}>
                <Grid item xs={3} sm={3}>
                     <Typography variant="subtitle1" color="secondary">Bid Amount</Typography>
                </Grid>
                <Grid item xs={5} sm={5}>
                    <Typography variant="subtitle1" color="secondary">Bid Time</Typography>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Typography variant="subtitle1" color="secondary">Bidder</Typography>
                </Grid>
            </Grid>
            {auction.bids.map((item, index) => {
                return (
                <Grid container key={index} spacing={4}>
                    <Grid item xs={3} sm={3}><Typography variant="body2">${item.bid}</Typography></Grid>
                    <Grid item xs={5} sm={5}><Typography variant="body2">{new Date(item.time).toLocaleString()}</Typography></Grid>
                    <Grid item xs={4} sm={4}><Typography variant="body2">{item.bidder.name}</Typography></Grid>
                </Grid>)
            })}
        </Box>
    </Box>
    )
}

export default Bidding