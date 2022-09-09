import React, { useState, useEffect } from 'react'

import { Typography,
} from '@mui/material'

import { calculateTimeLeft } from '../utils/helperFunctions'

const Timer = ({ endTime, updateEndTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date(endTime)))

    useEffect(() => {
        let timer = null
        if (!timeLeft.timeEnd) {
            timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft(new Date(endTime)))
            }, 1000)
        } else {
            updateEndTime()
        }

        return () => clearTimeout(timer)
    })
    return (
    <div>
        {!timeLeft.timeEnd 
        ? <Typography sx={{ fontWeight: '600' }}>
            {timeLeft.days !== 0 && `${timeLeft.days} days `}
            {timeLeft.hours !== 0 && `${timeLeft.hours} hours `}
            {timeLeft.minutes !== 0 && `${timeLeft.minutes} minutes `}
            {timeLeft.seconds !== 0 && `${timeLeft.seconds} seconds `}left
        </Typography>
        : <Typography>Auction ended.</Typography>}
    </div>
    )
}

export default Timer