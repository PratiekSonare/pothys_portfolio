import React from 'react'
import CartProducts from './CartProducts'
import CartProductsMobile from './CartProductsMobile'

const CartParent = () => {
  return (
    <>
        <CartProducts />
        <CartProductsMobile />
    </>
  )
}

export default CartParent