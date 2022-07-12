import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Paper, Typography,
    List, ListItemButton,
    Avatar, ListItemText
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';

import { listUsers } from './api-user'

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        listUsers(signal).then(res => {
            if (res && res.error) {
                console.log(res.error)
            } else {
                setUsers(res)
            }
        })

        return () => controller.abort()
    }, [])

    return (
    <Paper square sx={{
        pt: '2px',
        maxWidth: '800px',
        margin: 'auto',
    }}>
        <Typography sx={{
            m: '20px',
            mb: '0px',
            color: 'openTitle',
        }} variant='h6'>Users</Typography>
        <List>
            {users.map((user, idx) => (
                <Link key={idx} to={`/users/${user._id}`}>
                    <ListItemButton >
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                        <ListItemText primary={user.name} sx={{
                            ml: '12px',
                        }}/> 
                    </ListItemButton>
                </Link>
            ))}
        </List>
    </Paper>
    )
}

export default Users