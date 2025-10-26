import React, {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { useAuth } from '../authProvider'
import '../styles/bookdetails.css'


function Bookdetails() {
    const {id} = useParams()
    const [info, setInfo] = useState(null)
    const [wishlist, addWishlist] = useState(false)
    const [bookrequest, addRequest] = useState(false)
    const {token} = useAuth()

    useEffect(() => {
      fetch(`/browse/protected/${id}`, {
      headers:{'Authorization': `Bearer ${token}`}})
      .then(res => res.json())
      .then(data => setInfo(data))
      .catch(err => console.log(err))
    }, [id,token])

    useEffect(() => {
      fetch(`/request/protected/check/${id}`, {
      headers:{'Authorization': `Bearer ${token}`}})
      .then(res => res.json())
      .then(data => {
        if (data.message === 'exists'){
          addRequest(true)
        }
      })
      .catch(err => console.log(err))
    }, [id,token])

    useEffect(() => {
      fetch(`/wishlist/protected/check/${id}`, {
      headers:{'Authorization': `Bearer ${token}`}})
      .then(res => res.json())
      .then(data => {
        if (data.message === 'exists'){
          addWishlist(true)
        }
      })
      .catch(err => console.log(err))
    }, [id,token])

    const handleRequestClick = () => {
      fetch(`/request/protected/add/${id}`, {
      method: 'POST',
      headers:{'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'},
      body:JSON.stringify({title:info.title})})
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success'){
          addRequest(true)
        }
      })
      .catch(err => console.log(err))
    }

    const handleWishlistClick = () => {
      fetch(`/wishlist/protected/add/${id}`, {
      method: 'POST',
      headers:{'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'},
      body:JSON.stringify({title:info.title})})
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success'){
          addWishlist(true)
        }
      })
      .catch(err => console.log(err))
    }

    const handleWishlistRemoveClick = () => {
      fetch(`/wishlist/protected/remove/${id}`, {
      method: 'POST',
      headers:{'Authorization': `Bearer ${token}`}
      })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success'){
          addWishlist(false)
        }
      })
      .catch(err => console.log(err))
    }


  return (
    <div>
      <div className='bookdetails-container'>
        <div className='row'>
          <div className='col'><h2>Description</h2>
             {info && (
              <>
                <p className='lead'>{info.description}</p>
              </>)}         
          </div>
          <div className='col'>
            {info && (
              <>
                <h3>{info.title}</h3><br></br>
                <h4>Author:</h4><p>{info.author}</p>
                <h4>Year:</h4><p>{info.year}</p>
                <h4>Genre:</h4><p>{info.genre}</p>
              </>
            )}
            <button type='button' className='btn btn-success'
            onClick={handleRequestClick}
            disabled={bookrequest}>
            {bookrequest ? "Requested" : "Request Book"}
            </button><br></br>
            <button type='button' className='btn btn-warning'
            onClick={wishlist ? handleWishlistRemoveClick : handleWishlistClick}
            >
            {wishlist ? "Wishlisted" : "Wishlist Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bookdetails