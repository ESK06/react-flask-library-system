import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../authProvider'
import '../../styles/admintable.css'


function Books() {

    const navigate = useNavigate()
    
    const [books, setBooks] = useState([])
    const [showmodal, setShowModal] = useState(false)
    const[data,setData] = useState({
        title:'',
        author:'',
        genre:'',
        year:'',
        description:''
    })

    const {token, isAdmin, logout} = useAuth()
    

     useEffect(() => {
        if (!token){
            navigate('/', {replace: true})
        }
        else if (!isAdmin) {
            navigate('/home', { replace: true})
        }
        else{
            fetch('/admin/books/get/', {
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
        }
    },[token, isAdmin, logout, navigate])

    const bookInfo = (bookid) => {
      navigate(`/admin/books/update/${bookid}`)
    }

    const deletebook = async (bookid) => {
      const confirmation = window.confirm("Are you sure you want to delete this book?")
      if (confirmation){
        const response = await fetch('/admin/books/delete/', {
        method:'DELETE',
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'
            },
        body: JSON.stringify({'bookid':bookid})
        })
        if(response.status === 200){
          alert('Book Deletion Suceessful')
          window.location.reload()
        }
      }
      else{
        return
      }
    }

    const handleInput = (event) => {
        setData(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit = async (event) => {
      event.preventDefault()
    

      try{
          const response = await fetch('/admin/books/add/', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'},
              body: JSON.stringify(data)

          })

          const result = await response.json()

          if (result.message === 'success' && response.status === 201){
              alert('Book added')
              navigate('/')
          }
          
      }
      catch(err){
          console.error('Fetch error:', err);
      }
    }
    

  return (
    <div className='bookpanel'>
      <h1 className='text-center'>All Books</h1>
      <hr></hr><br></br>
      <div className='topbar'>
        <button type='button' onClick={() => setShowModal(true)} className='btn btn-primary btn-lg me-3'>Add a new Book</button>
        {showmodal && (
          <>
          <div className="modal d-block" role="dialog" aria-modal='true' tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">New Book</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form name='newbookform' onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <label htmlFor='title'>Title</label>
                    <input id='title' type='text' name='title' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
                    <label htmlFor='author'>Author</label>
                    <input id='author' type='text' name='author' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
                    <label htmlFor='genre'>Genre</label>
                    <input id='genre' type='text' name='genre' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
                    <label htmlFor='year'>Year</label>
                    <input id='year' type='number' name='year' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
                    <label htmlFor='desc'>Description</label>
                    <textarea id='desc' name='desc' rows={5} className='field form-control rounded-0' required
                    onChange={handleInput}></textarea>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    <button type="submit" className="btn btn-primary">Add</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
          </>
        )}
        <div className='searchbox'>
          <form name='search' className='d-flex' role='search'>
            <input className='form-control me-2' type='search' placeholder="Search" aria-label='Search'></input>
            <button className='btn btn-dark' type='submit'>Search</button>
          </form>
        </div>
      </div>
      <div className='table-container'>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Genre</th>
              <th scope="col">Year</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((books) => (
              <tr key={books.bookid}>
                <td>{books.title}
                   
                </td>
                <td>{books.author}
                 
                </td>
                <td>{books.genre}
                  
                </td>
                <td>{books.year}
                  
                </td>
                <td>{books.description}
                  
                </td>
                <td>
                    <button className='btn btn-secondary mb-2' onClick={()=>bookInfo(books.bookid)}>Edit</button>
                    <button className='btn btn-danger' onClick={()=>deletebook(books.bookid)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Books