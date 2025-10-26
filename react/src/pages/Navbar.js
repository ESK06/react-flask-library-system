import React from 'react'
import '../styles/navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'

function Navbar() {

  const navigate = useNavigate()  
  const {token, logout} = useAuth()
  
  const handlelogout = () => {
    logout()
    navigate('/')
  }


  return (
    <nav className='navbar'>
      <h2 className='navbar-logo pe-none'><em>MyLibrary</em></h2>
      <div className='navbar-links'>
        <Link to='/home' type='button' className='btn btn-light'>Home</Link>
        <Link to='/browse' type='button' className='btn btn-light'>Browse</Link>
        <Link to='/profile' type='button' className='btn btn-light'>My Profile</Link>
        {token ? (<button onClick={handlelogout} type='button' className='btn btn-light'>Logout</button>) : null}
      </div>
    </nav>
  )
}

export default Navbar