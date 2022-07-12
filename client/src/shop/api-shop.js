
export const createShop = async (user, tokenObj, shop) => {
    try {
        const response = await fetch(`/api/shops/by/${user.userId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            body: shop
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const listShops = async (signal) => {
    try {
        const response = await fetch('/api/shops', {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const listMyShops = async (signal, user, tokenObj) => {
    try {
        const response = await fetch(`/api/shops/by/${user.userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + tokenObj.t
            },
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const listShopDetail = async (signal, shop) => {
    try {
        const response = await fetch(`/api/shops/${shop.shopId}`, {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const updateShop = async (shop, tokenObj, updatedShop) => {
    try {
        const response = await fetch(`/api/shops/${shop.shopId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`,
            },
            body: updatedShop,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const deleteShop = async (shop, tokenObj) => {
    try {
        const response = await fetch(`/api/shops/${shop.shopId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`,
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}