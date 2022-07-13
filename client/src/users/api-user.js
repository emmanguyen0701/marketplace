export const signup = async (user) => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const listUsers = async (signal) => {
    try {
        const response = await fetch('/api/users', {
            signal: signal,
            method: 'GET'
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const readUser = async (user, tokenObj, signal) => {
    try {
        const response = await fetch(`/api/users/${user.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const updateUser = async (user, tokenObj, updatedUser) => {
    try {
        const response = await fetch(`/api/users/${user.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            body: JSON.stringify(updatedUser)
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const deleteUser = async (user, tokenObj) => {
    try {
        const response = await fetch(`/api/users/${user.userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + tokenObj.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const stripeUpdate = async (user, tokenObj, stripeCode, signal) => {
    try {
        const response = await fetch(`/api/users/stripe_auth/${user.userId}`, {
            method: 'PUT',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            body: JSON.stringify({ stripe: stripeCode })
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    } 
}