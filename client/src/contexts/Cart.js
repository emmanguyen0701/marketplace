import React, { useState, createContext, useContext } from 'react'

import cart from '../cart/cart-helper'

const CartContext = createContext(null)

const useCart = () => {
    const [cartItems, setCartItems] = useContext(CartContext)

    const handleCartItems = (value) => {
        setCartItems(value)
    }

    return { cart: cartItems, onChangeCart: handleCartItems  }
}

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(cart.getCart())
    return (
        <CartContext.Provider value={[cartItems, setCartItems]}>
            {children}
        </CartContext.Provider>
    )
}

export { CartProvider, useCart }