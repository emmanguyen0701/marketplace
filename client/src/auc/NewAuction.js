import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { TextField, Button,
    Card, CardContent, CardActions, 
    Typography, Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { createAuction } from './api-auction'


const getDateString = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth().toString().length === 1 ? '0' +  (date.getMonth()+1) : (date.getMonth() + 1)
    const day = date.getDate().toString().length === 1 ? '0' + (date.getDate()) : date.getDate()
    const hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
    const minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
    
    let dateString = `${year}-${month}-${day}T${hours}:${minutes}`
    return dateString
}

const NewAuction = () => {
    const curDate = new Date()
    const defaultStartTime = getDateString(curDate)
    const oneHourFromNow = new Date(curDate.setHours(curDate.getHours() + 1))
    const defaultEndTime = getDateString(oneHourFromNow)

    const authObj = auth.isAuthenticated()

    const [values, setValues] = useState({
        error: '',
        image: '',
        itemName: '',
        description: '',
        startingBid: 0,
        bidStart: defaultStartTime,
        bidEnd: defaultEndTime,
        redirected: false,
    })

    const handleInputChange = name => event => {
        const inputVal = event.target.files ? event.target.files[0] : event.target.value
        setValues({ ...values, [name]: inputVal })
    }

    const handleSubmit = () => {
        if (values.bidEnd <= values.bidStart) {
            setValues({ ...values, error: "Auction end time must be larger than start time" })
        }
        const form = new FormData()
        const description = values.description || ''
        form.append('image', values.image)
        form.append('itemName', values.itemName)
        form.append('description', description)
        form.append('startingBid', values.startingBid)
        form.append('bidStart', values.bidStart)
        form.append('bidEnd', values.bidEnd)
        if (!values.image) {
            setValues({ ...values, error: 'Image is required.' })
            return
        }
        const validateFailed = !values.itemName || !values.startingBid || !values.bidStart || !values.bidEnd
        if (validateFailed) {
            setValues({ ...values, error: 'Please fill in required fields' })
            return
        }
        createAuction(authObj, form).then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, redirected: true })
            }
        })
    }

    if (values.redirected) {
        return (<Navigate to='/auctions/all' /> )
    }

    return (
    <Card sx={{ maxWidth: '600px', m: 'auto', mt: '20px' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h5' sx={{ mb: '20px' }}>New Auction</Typography>
            {values.error && 
            <Typography sx={{ mb: '20px', color: 'error.main' }}>{values.error}</Typography>}
            <Box sx={{ width: '65%', display: 'flex', justifyContent: 'space-around' }}>
                <label htmlFor='upload-image-btn'>Upload image:</label>
                <input id='upload-image-btn'
                type='file'
                accept='image/*'
                onChange={handleInputChange('image')} 
                />
            </Box>
            <TextField sx={{ width: '80%', mb: '30px', mt: '10px' }}
                required
                label='Item Name' variant='standard'
                name='itemName' 
                value={values.itemName}
                onChange={handleInputChange('itemName')} 
            />
            <TextField multiline rows='2' sx={{ width: '80%' }}
                label='Description' variant='standard'
                name='description'
                value={values.description}
                onChange={handleInputChange('description')} 
            />
            <TextField sx={{ width: '80%', mb: '30px', mt: '10px' }}
                required
                label='Starting Bid' variant='standard'
                name='startingBid' 
                type='number'
                value={values.startingBid}
                onChange={handleInputChange('startingBid')} 
            />
            <TextField sx={{ width: '80%', mb: '30px', mt: '10px' }}
                required
                label='Auction Start Time' variant='standard'
                name='bidStart' 
                type='datetime-local'
                value={values.bidStart}
                onChange={handleInputChange('bidStart')} 
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: defaultStartTime }}
            />
            <TextField sx={{ width: '80%', mb: '30px', mt: '10px' }}
                required
                label='Auction End Time' variant='standard'
                name='bidEnd' 
                type='datetime-local'
                value={values.bidEnd}
                onChange={handleInputChange('bidEnd')} 
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: defaultStartTime }}
            />
            <Box sx={{ width: '80%', display: 'flex', justifyContent: 'center', mt: '20px'  }}>
                <CardActions>
                    <Button onClick={handleSubmit}
                    sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', 'width': '80px', '&:hover': { bgcolor: '#b82727' } }}
                    >Submit</Button>
                </CardActions>
                <CardActions>
                    <Button sx={{ bgcolor: 'tertiary.main', color: 'tertiary.contrastText', width: '80px', '&:hover': { bgcolor: 'tertiary.hover' } }}
                    >Cancel</Button>
                </CardActions>
            </Box>
        </CardContent>
    </Card>
    )
}

export default NewAuction



