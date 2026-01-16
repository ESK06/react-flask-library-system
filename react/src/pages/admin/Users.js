import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../authProvider'
import '../../styles/admintable.css'

function Users() {

    const navigate = useNavigate()
    
    const [users, setUsers] = useState([])
    const [showmodal, setShowModal] = useState(false)
    const[data,setData] = useState({
      name:'',
      email:'',
      password:''
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
            fetch('/admin/user/get/', {
            headers:{'Authorization': `Bearer ${token}`}} )
            .then((res) => {
            if (res.status === 401){
                logout()
                navigate('/')
                return
            }
            return res.json()})
            .then((data) => {if(data) {setUsers(data)}})
            .catch((err) => console.log(err))
        }
    },[token, isAdmin, logout, navigate])

    const userInfo = (userid) => {
      navigate(`/admin/users/update/${userid}`)
    }
    

    const resetpsw = async (userid) => {
      const newpsw = window.prompt('Enter the new password:')

      if (newpsw !== null){
        const response = await fetch('/admin/user/resetpsw/', {
          method:'POST',
          headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
              },
          body: JSON.stringify({'userid':userid, 'newpassword': newpsw})
        })
        if(response.status === 200){
          alert('Password Reset Suceessful')
        }
      }
      else{
        return
      }
    }

    const deleteuser = async (userid) => {
      const confirmation = window.confirm("Are you sure you want to delete this account?")
      if (confirmation){
        const response = await fetch('/admin/user/delete/', {
        method:'DELETE',
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'
            },
        body: JSON.stringify({'userid':userid})
        })
        if(response.status === 200){
          alert('Account Deletion Suceessful')
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
            const response = await fetch('/signup/', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(data)

            })

            const result = await response.json()

            if (result.message === 'success' && response.status === 201){
                alert('Account Created')
                navigate('/')
            }
            else if (result.message === 'email exists'){
                alert('Email exists. Use another email')
            }
        }
        catch(err){
            console.error('Fetch error:', err);
        }
    }


  return (
    <div className='userpanel'>
      
      <h1 className='text-center'>All Available Users</h1>
      <hr></hr><br></br>
      <div className='topbar'>
        <button type='button' onClick={() => setShowModal(true)} className='btn btn-primary btn-lg me-3'>Add a new user</button>
        {showmodal && (
          <>
          <div className="modal d-block" role="dialog" aria-modal='true' tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">New User</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form name='signupform' onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <label htmlFor='name'>Name</label>
                    <input id='name' type='text' name='name' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
                    <label htmlFor='email'>Email</label>
                    <input id='email' type='email' name='email' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' name='password' className='field form-control rounded-0' required
                    onChange={handleInput}></input>
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
            <input className='form-control me-2' type='text' placeholder="Search" aria-label='Search'></input>
            <button className='btn btn-dark' type='submit'>Search</button>
          </form>
        </div>
      </div>
      <div className='table-container'>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Is Admin</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((users) => (
              <tr key={users.userid}>
                <td>{users.name}
                </td>
                <td>{users.email}
                  
                </td>
                <td>{users.isAdmin  ? 'Yes' : 'No'}</td>
                <td>{users.isAdmin  ? ('Unavailable') : (
                  <>
                    <button className='btn btn-secondary' onClick={() =>resetpsw(users.userid)}>Reset Password</button> <button className='btn btn-success' onClick={()=>userInfo(users.userid)}>Edit Account</button> <button className='btn btn-danger' onClick={() =>deleteuser(users.userid)}>Delete Account</button>
                  </>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  )
}

export default Users