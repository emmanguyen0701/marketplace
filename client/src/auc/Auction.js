import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import { Card, CardHeader, CardMedia,
     Grid, Typography,
} from '@mui/material'

import Timer from './Timer'
import auth from '../auth/auth-helper'
import { getAuction } from './api-auction'
import Bidding from './Bidding'


const Auction = () => {
    const [auction, setAuction] = useState({})
    const params = useParams()
    const [auctionEnd, setAuctionEnd] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getAuction({ auctionId: params.auctionId }, signal)
        .then(res => {
            setAuction(res)
        })

        return () => controller.abort()
    }, [params.auctionId])

    const currentDate = new Date()

    const imageUrl = auction._id && `/api/auctions/image/${auction._id}?${new Date().getTime()}`

    const updateEndTime = () => {
        setAuctionEnd(true)
    }

    const updateBids = (updatedAuction) => {
        setAuction(updatedAuction)
    }

    return (
    <Card>
        <CardHeader title={auction.itemName?.toUpperCase()}
        subheader={<span>
            {currentDate < new Date(auction.bidStart) && `Auction Not Started.`}
            {currentDate > new Date(auction.bidEnd) && `Auction Ended.` }
            {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && 'Auction Live.'}
            </span>}
        />
        <Grid container spacing={6}  sx={{ paddingLeft: '18px' }}>
            <Grid item xs={5} sm={5}>
                <CardMedia title={auction.itemName}
                component='img'
                alt={auction.itemName}
                image={imageUrl}
                />
                <Typography component="p" variant="subtitle1"  sx={{ margin: '10px 0 16px' }}>About Item</Typography>
                <Typography component="p">{auction.description}</Typography>
            </Grid>
            {currentDate < new Date(auction.bidEnd) && (
                <Grid item xs={7} sm={7}>
                    {currentDate > new Date(auction.bidStart) 
                    ? (<div>
                        <Timer endTime={auction.bidEnd} updateEndTime={updateEndTime} />
                        <Typography>(Auction ends at: {new Date(auction.bidEnd).toLocaleString()})</Typography>
                        {!auth.isAuthenticated() && <Typography>Please <Link to='/signin' sx={{ fontWeight: '600' }}>sign in</Link> to place bids</Typography>}
                        {auth.isAuthenticated() && 
                        <Bidding auction={auction} justEnd={auctionEnd} updateBids={updateBids} />
                        }
                    </div>)
                    : <Typography>{`Auction will start at ${new Date(auction.bidStart).toLocaleString()}`}</Typography>}
                </Grid>
            )}
        </Grid>
    </Card>
    )
}

export default Auction