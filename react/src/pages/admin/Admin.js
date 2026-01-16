import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../authProvider'
import '../../styles/admin.css'


function Admin() {

    const navigate = useNavigate()

    const {token, isAdmin} = useAuth()

    useEffect(() => {
        if (!token){
          navigate('/', {replace: true})
        }
        else if (!isAdmin) {
            navigate('/home', { replace: true})
        }
    }, [token, isAdmin, navigate])


  const userspanel = () => {
    navigate('/admin/users')
  }

  const bookspanel = () => {
    navigate('/admin/books')
  }

  const requestspanel = () => {
    navigate('/admin/requests')
  }

  return (
    <div className='adminpanel'>
      <h1>Welcome to Admin Page</h1>
      <hr></hr><br></br>

      <u><h4>Select an option</h4></u><br></br>
      <div className='button-group'>
        <button type='button' className='btn' onClick={userspanel}>Users</button>
        <button type='button' className='btn' onClick={bookspanel}>Books</button>
        <button type='button' className='btn' onClick={requestspanel}>Requests</button>
      </div>

    </div>
  )
}

export default Admin