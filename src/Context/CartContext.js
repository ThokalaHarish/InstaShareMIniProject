import React from 'react'

const CartContext = React.createContext({
  searchCaption: '',
  onChangeSearchCaption: () => {},
})

export default CartContext
