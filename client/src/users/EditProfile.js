import React, { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { Card, CardContent, CardActions,
    Button, Typography, TextField,
    FormControlLabel, Switch, Box,
} from '@mui/material'

import auth from '../auth/auth-helper'
import { readUser, updateUser } from './api-user'


const EditProfile = () => {
    const params = useParams()
    const [values, setValues] = useState({
        user: {
            email: '',
            name: '',
            password: '',
            seller: false,
        },
        error: '',
        redirectToProfile: false,
    })
    const authObj = auth.isAuthenticated()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        readUser({ userId: params.userId }, { t: authObj.token }, signal)
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, user: res })
            }
        })

        return () => controller.abort()
    }, [])

    const handleChange = name => event => {
        setValues({ ...values, user: { ...values.user, [name]: event.target.value } })
    }

    const handleCheck = (event) => {
        setValues({ ...values, user: { ...values.user, seller: event.target.checked } })
    }

    const handleSubmit = () => {
        updateUser({ userId: params.userId }, { t: authObj.token }, values.user)
        .then(res => {
            if (res && res.error) {
                setValues({ ...values, error: res.error })
            } else {
                auth.updateJWT(res, () => {
                    setValues({ ...values, redirectToProfile: true })
                })
            }
        })
    }

    if (values.redirectToProfile) {
        return (<Navigate to={`/users/${params.userId}`} />)
    }

    return (
    <Card sx={{
        maxWidth: '600px',
        m: 'auto',
        textAlign: 'center',
        mt: '26px',
        pb: '10px',
    }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ mt: '4px', pb: '8px', color: 'openTitle' }}
                variant='h5' 
            >Edit Profile</Typography>
            <TextField sx={{ width: '300px', mb: '16px', }} 
                label='Name' variant="standard"
                name='name' type='text'
                value={values.user.name}
                onChange={handleChange('name')}
                />
            <TextField sx={{ width: '300px', mb: '16px', }}
                label='Email' variant="standard"
                name='email' type='text'
                value={values.user.email}
                onChange={handleChange('email')}
                />
            <Box sx={{ display: 'flex', width: '300px', mt: '10px', justifyContent: 'space-between' }}>
                <Typography variant='subtitle1'>Seller Account:</Typography>
                <FormControlLabel 
                    control={
                        <Switch checked={values.user.seller} 
                            onChange={handleCheck}
                        />} 
                    label={values.user.seller ? 'Active' : 'Inactive'}
                />
            </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', }}>
            <Button sx={{
                    bgcolor: 'primary.main' ,
                    width: '300px',
                    borderRadius: '2px',
                }}
                type='submit' variant='contained'
                onClick={handleSubmit}>SUBMIT</Button>
        </CardActions>
    </Card>)
}

export default EditProfile