import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'
import '../styles/browse.css'

function History() {

  const [books, setBooks] = useState([])
  const {token, logout} = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch('/request/protected/', {
    headers:{'Authorization': `Bearer ${token}`}} )
    .then((res) => {
      if (res.status === 401){
        logout()
        navigate('/')
        return
      } 
      return res.json()})
    .then((data) => {if(data) {setBooks(data)}})
    .catch((err) => console.log(err))
  },[token, logout, navigate])

  return (
    <div className='browse-container'>
      <h1>Your Requested History</h1>
      {books.length === 0 ?(<h2>Not Found</h2>) :
      (<ul className='list-group list-group-flush'>
        {books.map((books) => (
          <li className='list-group-item' key={books.book_id}>
            <div className='card shadow-0 bg-transparent'>
              <div className='card-body text-center'>
                <Link to = {`/browse/${books.book_id}`} className='stretched-link text-decoration-none'>
                  <h5 className='card-title fw-bold'>{books.title}</h5>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>)}
        
    </div>
  )
}

export default History