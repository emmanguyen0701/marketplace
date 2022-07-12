const cartObj = {
    addItem: (item) => {
        let cart = []
        if (window && localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        const existingItem = cart.find(cartItem => cartItem.product._id === item._id)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            cart.push({
                product: item,
                quantity: 1,
                shop: item.shop._id,
            })
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        return cart
    },
    getCart: () => {
        if (window && localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'))
        } else {
            return []
        }
    },
    updateCart: (index, quantity) => {
        let cart = []
        if (window && localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart[index].quantity = quantity
        localStorage.setItem('cart', JSON.stringify(cart))
        return cart
    },
    removeItemFromCart: (index) => {
        let cart = []
        if (window && localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))
        }
        cart.splice(index, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
        return cart
    },
    emptyCart: (cb) => {
        if (window && localStorage.getItem('cart')) {
            localStorage.removeItem('cart')
            cb()
        }
    },
}

export default cartObj