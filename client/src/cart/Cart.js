import React, { useState } from 'react'

import CartItems from './CartItems'
import CheckoutForm from './CheckoutForm'


const Cart = () => {
    const [checkout, setCheckout] = useState(false)

    const showCheckout = val => {
        setCheckout(val)
    }

    return (
    <div>
        <CartItems checkout={checkout} showCheckout={showCheckout} />
        {checkout && <CheckoutForm />}
    </div>
    )
}

export default Cart