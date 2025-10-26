import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'
import '../styles/home.css'

function Home() {

  const navigate = useNavigate()
  const {token} = useAuth()
  const [search, setSearch] = useState({
      query: ''
    })
  
  const handleInput = (event) => {
        setSearch(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    navigate(`/results?query=${encodeURIComponent(search.query)}`)
  }
  

  useEffect(() => {
    if (!token){
      navigate('/', {replace: true})
    }
  }, [token, navigate])

  const browsepage = () => {
    navigate('/browse/')
  }

  const history = () => {
    navigate('/history/')
  }

  const wishlist = () => {
    navigate('/wishlist/')
  }


  return (
    <div>
      <div className='home-container'>
          <h1>Welcome to Library</h1>
          <form name='searchform' onSubmit={handleSubmit}>
            <input className='field' onChange={handleInput} type='text' name='query' value={search.query} 
            placeholder='Enter Book Name'></input>
            <button className='btn btn-dark'>Search</button>
          </form>

          <br></br><button onClick={browsepage} className='btn btn-dark'>Browse Books</button><br></br>
          <br></br>
          <br></br><h4>Your Options</h4>

            <button type='button' className='btn btn-outline-dark' onClick={history}>Your History</button>
            <button type='button' className='btn btn-outline-dark' onClick={wishlist}>My Wishlist</button>

      </div>
    </div>
  )
}

export default Home