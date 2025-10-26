import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'
import '../styles/myprofile.css'

function Myprofile() {

  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [password, setNewPassword] = useState({
    oldPassword : '',
    newPassword : '',
    confirmPassword:''
  })
  const {token, logout} = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token){return}
    fetch('/username/get/', {
    headers:{'Authorization': `Bearer ${token}`}} )
    .then((res) => {
      if (res.status === 401){
        logout()
        navigate('/')
        return
      }
      return res.json()})
    .then((data) => {if (data) setUsername(data.name)})
    .catch((err) => console.log(err))
  },[token, logout, navigate])

  const handleUsernameInput = (event) => {
    setNewUsername(event.target.value)
  }

  const handlePasswordInput = (event) => {
    setNewPassword(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  const handleUsernameUpdate = () =>{
    fetch('/username/update/', {
      method: 'POST',
      headers:{'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'},
      body:JSON.stringify({'newusername':newUsername})})
    .then(res => res.json())
    .then(res => {
      if (res.message === 'success'){
        setUsername(newUsername)
        setNewUsername('')
        alert('Username Updated')
      }
    })
    .catch(err => console.log(err))

  }

  const handlePasswordUpdate = () =>{
    if (password.newPassword !== password.confirmPassword){
      alert('Password does not match')
      return
    }
    fetch('/password/update/', {
      method: 'POST',
      headers:{'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'},
      body:JSON.stringify({'oldpassword':password.oldPassword, 'newpassword':password.confirmPassword})})
    .then(res => res.json())
    .then(res => {
      if (res.message === 'success'){
        setNewPassword({oldPassword:'', newPassword:''})
        alert('Password Updated Login Again')
        logout()
        navigate('/')
      }
      else {
        alert('Password Updated Failed (Wrong Password)')
      }
    })
    .catch(err => console.log(err))

  }


  return (
    <div className='myprofile-container'>
        <h2>Update Your Details</h2><br></br>
        <h4>Name: {username}</h4>
        <input className='field' type='text' placeholder='Enter To Update' onChange={handleUsernameInput} value={newUsername}></input>
        <br></br>
        <button type='submit' className='btn btn-success' onClick={handleUsernameUpdate}>Update</button>

        <br></br>
        
        <h3>Password</h3><br></br>
         <h4>Enter Current Password</h4>
        <input type='password' name='oldPassword' placeholder='Enter To Update' onChange={handlePasswordInput} value={password.oldPassword} className='field'></input>
        
        <h4>Enter New Password</h4>
        <input type='password' name='newPassword' placeholder='Enter To Update' onChange={handlePasswordInput} value={password.newPassword} className='field'></input>

        <h4>Confirm New Password</h4>
        <input type='password' name='confirmPassword' placeholder='Enter To Update' onChange={handlePasswordInput} value={password.confirmPassword} className='field'></input>
        <br></br>

        <button type='submit' onClick={handlePasswordUpdate} className='btn btn-success'>Update</button>
    </div>
  )
}

export default Myprofile