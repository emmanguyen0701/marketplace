
export const signin = async (user) => {
    try {
        const response = await fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                credentials: 'include',
            },
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const signoutAPI = async () => {
    try { 
        const response = await fetch('http://localhost:3000/auth/signout', {
            method: 'GET',
        })
        return await response.json()
    } catch(err) {
        console.log('FROM signoutAPI', err)
    }
}