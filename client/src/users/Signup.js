import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'

import { Card, CardContent, CardActions,
    Button, Typography, TextField
} from '@mui/material'

import auth from '../auth/auth-helper'
import { signinWithGoogle } from '../auth/api-auth'
import { signup } from './api-user'

const Signup = () => {
    const location = useLocation()

    const [values, setValues] = useState({
        email: '',
        name: '',
        password: '',
        error: '',
        open: false,
        redirectToRefresh: false,
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const handleSubmit = () => {
        signup(values).then(res => {
            if (res.error) {
                setValues({ ...values, error: res.error })
            } else {
                setValues({ ...values, open: true })
            }
        })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }


    let { from } = location.state || { from: { pathname: '/' } }
    if (values.redirectToRefresh) {
       return <Navigate to={from} state={{ from: '/signup' }} />
    }

    if (values.open) {
        return <Navigate to='/signin' state={{ from: '/signup' }} />
    }

    return (
    <Card sx={{
        maxWidth: '600px',
        m: 'auto',
        textAlign: 'center',
        mt: '26px',
        pb: '10px',
    }}>
        <CardContent>
            <Typography variant='h5' sx={{
                    mt: '4px',
                    pb: '8px',
                    color: 'openTitle'
                }}>Sign up</Typography>
            <TextField sx={{ width: '300px', mb: '16px', }} 
                label='Name' variant="standard"
                name='name' type='text'
                value={values.name}
                onChange={handleChange('name')}
                />
            <TextField sx={{ width: '300px', mb: '16px', }} 
                label='Email' variant="standard"
                name='email' type='text'
                value={values.email}
                onChange={handleChange('email')}
                />
            <TextField sx={{ width: '300px', }} 
                label='Password' variant="standard"
                name='password' type='password'
                value={values.password}
                onChange={handleChange('password')}
                onKeyPress={handleKeyPress}
                />
                {values.error && (
                    <Typography sx={{ color: 'error.main', pt: '20px' }}>{values.error}</Typography>
                )}
        </CardContent>
        <CardActions sx={{
                justifyContent: 'center',
            }}>
            <Button sx={{
                    bgcolor: 'primary.main' ,
                    width: '300px',
                    borderRadius: '2px',
                }}
                type='submit' variant='contained'
                onClick={handleSubmit}>Sign up</Button>
        </CardActions>
    </Card>
    )
}

export default Signup