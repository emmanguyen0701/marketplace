export const getOrder = async (params, tokenObj, signal) => {
    try {
        const res = await fetch(`/api/orders/${params.orderId}`, {
            method: 'GET',
            signal: signal,
            headers: {
                'Authorization': `Bearer ${tokenObj.t}`
            }
        })
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

export const createOrderAndCharge = async (params, tokenObj, order) => {
    try {
        const res = await fetch(`/api/orders/${params.shopId}/createCharge/${params.userId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            body: JSON.stringify(order),
        })
        const data = await res.json()
        return data
    } catch(err) {
        console.log(err)
    }
}



export const getOrdersByShop = async (shop, tokenObj, signal) => {
    try {
        const res = await fetch(`/api/orders/shop/${shop.shopId}`, {
            headers: {
                'Authorization': `Bearer ${tokenObj.t}`
            },
            signal: signal,
        })
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

export const getStatusValues = async (signal) => {
    try {
        const res = await fetch('/api/orders/status_values', {
            method: 'GET',
            signal: signal
        })
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

export const cancelOrder = async (params, tokenObj, products) => {
    try {
        const res = await fetch(`/api/orders/${params.shopId}/cancel/${params.orderId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            body: JSON.stringify(products)
        })
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

export const updateOrderStatus = async (params, tokenObj, order) => {
    try {
        const res = await fetch(`/api/orders/${params.shopId}/status`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`
            },
            body: JSON.stringify(order)
        })
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

export const getOrdersByUsers = async (params, tokenObj, signal) => {
    try {
        const res = await fetch(`/api/orders/user/${params.userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenObj.t}`
            },
            signal: signal,
        })
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}