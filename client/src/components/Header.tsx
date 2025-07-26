import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <div>
       <NavLink to='/'>Dashboard</NavLink>
       <NavLink to='/billing'>Billing</NavLink>
       <NavLink to='/products'>Products</NavLink>
       <NavLink to='/saleshistory'>SalesHistory</NavLink>
    </div>
  )
}

export default Header