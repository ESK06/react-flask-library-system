import React, {useEffect, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import { useAuth } from '../authProvider'
import '../styles/browse.css'

function Results() {
  
  const [books, setBooks] = useState([])
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const {token} = useAuth()


  useEffect(()=>{
      if (query) {
        fetch(`/search/protected/?query=${encodeURIComponent(query)}`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'},

        })
        .then((res) => res.json())
        .then((data) => setBooks(data))
        .catch((err) => console.log(err))
      }
  },[query,token])

  

  return (
    <div className='browse-container'>
    
        <h1>Results</h1>
        {books.length === 0 ?(<h2>Not Found</h2>) :
        (<ul className='list-group list-group-flush'>
        {books.map((books) => (
          <li className='list-group-item' key={books.id}>
              <div className='card shadow-0 bg-transparent'>
                <div className='card-body text-center'>
                  <Link to = {`/browse/${books.id}`} className='stretched-link text-decoration-none'>
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

export default Results