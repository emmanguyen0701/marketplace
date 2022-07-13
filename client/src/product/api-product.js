import queryString from 'query-string'

export const createProduct = async (shop, tokenObj, product) => {
    try {
        const response = await fetch(`/api/products/by/${shop.shopId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`,
            },
            body: product,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const getCategories = async (signal) => {
    try {
        const response = await fetch('/api/products/categories', {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const getProducts = async (params) => {
    try {
        const query = queryString.stringify(params)
        const response = await fetch('/api/products?' + query)
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const getProductsByShop = async (signal, shop) => {
    try {
        const response = await fetch(`/api/products/by/${shop.shopId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            signal: signal
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const listProductDetail = async (signal, product) => {
    try {
        const response = await fetch(`/api/products/${product.productId}`, {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const updateProduct = async (shop, product, tokenObj, updatedProduct) => {
    try {
        const response = await fetch(`/api/products/${shop.shopId}/${product.productId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Authorization': `Bearer ${tokenObj.t}`,
            },
            body: updatedProduct,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
} 

export const deleteProduct = async (shop, product, tokenObj) => {
    try {
        const response = await fetch(`/api/products/${shop.shopId}/${product.productId}`, {
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

export const getLatestProducts = async (signal) => {
    try {
        const response = await fetch('/api/products/latest', {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export const getRelatedProducts = async (signal, product) => {
    try {
        const response = await fetch(`/api/products/related/${product.productId}`, {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}