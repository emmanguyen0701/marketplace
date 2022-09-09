import React from 'react'
import { useNavigate } from 'react-router-dom'

import { List, ListItem, ListItemAvatar,
    Avatar, ListItemText, ListItemSecondaryAction,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { calculateTimeLeft } from '../utils/helperFunctions'

const Auctions = ({ auctions }) => {
    const currentDate = new Date()
    const navigate = useNavigate()


    const showTimeLeft = (date) => {
        let timeLeft = calculateTimeLeft(date)
        const daysL = (!!timeLeft.days && `${timeLeft.days}d `) || `0d `
        const hoursL = (!!timeLeft.hours && `${timeLeft.hours}h `) || `0h `
        const minutesL = (!!timeLeft.minutes && `${timeLeft.minutes}m `) || `0m `
        const secondsL = (!!timeLeft.seconds && `${timeLeft.seconds}s `) || `0s `

        return !timeLeft.timeEnd && <span>{daysL + hoursL + minutesL + secondsL + `left`}</span>
    }

    const auctionState = (auction) => {
        return (
        <span>
            {(currentDate < new Date(auction.bidStart)) && `Auction starts at ${new Date(auction.bidStart).toLocaleString()}` }
            {(currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && `Auction is live | ${auction.bids.length} bids | Time Left: ${showTimeLeft(new Date(auction.bidEnd)).props?.children}` )}
            {(currentDate > new Date(auction.bidStart)) && auction.bids.length > 0 && `Last Bid: ${auction.bids[0].bid}` }
            {(currentDate > new Date(auction.bidEnd)) && `Auction ended | ${auction.bids.length} bids`}
        </span>)
    }

    return (
    <List sx={{
        maxWidth: 600,
        margin: 'auto',
        paddingTop: '20px',
        }}>
        {auctions.map((a, i) => (
            <ListItem key={i}>
                <ListItemAvatar>
                    <Avatar variant='square' src={`/api/auctions/image/${a._id}?${new Date().getTime()}`}/>
                </ListItemAvatar>
                <ListItemText primary={a.itemName} secondary={auctionState(a)} />
                <ListItemSecondaryAction>
                    <VisibilityIcon sx={{ '&:hover': { cursor: 'pointer' } }}
                    onClick={() => navigate(`/auction/${a._id}`)}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
    )
}

export default Auctions