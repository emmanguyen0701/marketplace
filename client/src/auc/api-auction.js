export const createAuction = async (tokenObj, auction) => {
    try {
        const response = await fetch(`/api/auctions/by/${tokenObj.user._id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Authorization': `Bearer ${tokenObj.token}`,
            },
            body: auction,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const getAllAuctions = async (signal) => {
    try {
        const res = await fetch('/api/auctions/', {
            method: 'GET',
            signal: signal,
        })
        
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

export const getAuction = async (auction, signal) => {
    try {
        const res = await fetch(`/api/auctions/${auction.auctionId}`, {
            method: 'GET',
            signal: signal,
        })

        return await res.json()
    } catch(err) {
        console.log(err)
    }
}