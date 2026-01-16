import React, {useState, useEffect} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../../authProvider'
import '../../styles/adminedit.css'

function AdminEdit() {

    const {id, type} = useParams()
    const [info, setInfo] = useState({})
    const [newData, setNewData] = useState({})
    const navigate = useNavigate()

    const {token, isAdmin, logout} = useAuth()

    let url =''

     if (type ==='users'){ 
      url = `/admin/user/update/${id}`
    }
    else if(type ==='books') {
      url= `/admin/books/update/${id}`
    }

    useEffect(() => {
         if (!token){
          navigate('/', {replace: true})
        }
        else if (!isAdmin) {
            navigate('/home', { replace: true})
        }
        else {
        fetch(url, {
        headers:{'Authorization': `Bearer ${token}`}})
        .then(res => {
            if (res.status === 401){
              logout()
              navigate('/')
              return
            }
          return res.json()})
        .then(data => setInfo(data))
        .catch(err => console.log(err))
        }
    }, [id,token,isAdmin,logout,navigate,url])

    useEffect(() => {
      setNewData(info);
    }, [info]);



    const handleInput = (event) => {
      setNewData(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit = async (event) => {
      event.preventDefault()

      try{
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'
            },
            body: JSON.stringify(newData)

        })

        if (response.status === 200){
            alert('Updated Suceessfully')
        }
        else{
          alert('Failed, Try Again')
        }

      }
      catch(err){
          console.error('Fetch error:', err);
      }
    }
    
   

  return (
    <div>
      <h1 className='text-center'>Update Info</h1>
      <hr></hr><br></br>
      <form className='editform' onSubmit={handleSubmit}>
        {Object.entries(newData).map(([key,value]) => (          
            <div className="mb-3" key={key}>
                <label className="form-label">{key}</label>
                {key === 'Description' ? (
                  <textarea className="field form-control" value={value} name={key} onChange={handleInput} rows={5}></textarea>)
                  :
                (<input type="text" className="field form-control" value={value} name={key} onChange={handleInput}></input>)
                }
            </div>
        ))}
        <button type='submit' className='btn btn-success'>Update</button>
        <Link to='/admin' type='button' className='btn btn-dark'>Cancel</Link>
      </form>
        

    </div>
  )
}

export default AdminEdit