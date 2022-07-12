import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { TextField, Button,
    Card, CardContent, CardActions, 
    Typography
} from '@mui/material'

import { signin } from './api-auth'
import auth from './auth-helper'


const Signin = () => {
    const location = useLocation()

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToRefresh: false,
    })

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value})
    }

    const handleSubmit = () => {
        const user = {
            email: values.email,
            password: values.password,
        }
        
        signin(user).then((res) => {
            if (res.error) {
                setValues({ ...values, error: res.error })
            } else {
                auth.authenticate(res, () => {
                    setValues({ ...values, redirectToRefresh: true })
                })
            }
        })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    let { from } = location?.state || { from: '/' }
    if (from === '/signup') from = '/'
    if (values.redirectToRefresh) {
       return <Navigate to={from} state={{ from: '/signin' }} />
    }

    return (
    <div>
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
                }}>Sign In</Typography>
                <TextField sx={{ width: '300px', mb: '16px' }} 
                    label="Email" variant="standard" 
                    name='email'
                    value={values.email} 
                    onChange={handleChange('email')} />
                <TextField sx={{ width: '300px' }} 
                    label="Password" variant="standard" 
                    type='password' 
                    name='password'
                    value={values.password}
                    onChange={handleChange('password')} 
                    onKeyPress={handleKeyPress} />
                {values.error && (
                    <Typography sx={{ color: 'error.main', pt: '20px' }}>{values.error}</Typography>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', }}>
                <Button sx={{
                    bgcolor: 'primary.main' ,
                    width: '300px',
                    borderRadius: '2px',
                }}
                variant="contained" type='submit'
                onClick={handleSubmit}>Sign in</Button>
            </CardActions>
        </Card>
    </div>
    )
}

export default Signin