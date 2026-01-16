import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../authProvider'
import '../../styles/admintable.css'


function Requests() {

    const navigate = useNavigate()

    const [requests, setRequests] = useState([])
    const [requestsHistory, setRequestsHistory] = useState([])

    const {token, isAdmin, logout} = useAuth()

    useEffect(() => {
        if (!token){
            navigate('/', {replace: true})
        }
        else if (!isAdmin) {
            navigate('/home', { replace: true})
        }
        else{
            fetch('/admin/requests/get/', {
            headers:{'Authorization': `Bearer ${token}`}} )
            .then((res) => {
            if (res.status === 401){
                logout()
                navigate('/')
                return
            }
            return res.json()})
            .then((data) => {if(data) {setRequests(data)}})
            .catch((err) => console.log(err))

            fetch('/admin/requests/history/get/', {
            headers:{'Authorization': `Bearer ${token}`}} )
            .then((res) => {
            if (res.status === 401){
                logout()
                navigate('/')
                return
            }
            return res.json()})
            .then((data) => {if(data) {setRequestsHistory(data)}})
            .catch((err) => console.log(err))
        }
    }, [token, isAdmin, logout, navigate])

    const requeststatus = async (requestid, status) => {
      const response = await fetch('/admin/requests/update/', {
        method:'POST',
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json'
            },
        body: JSON.stringify({'requestid':requestid, 'status': status})
      })
      if(response.status === 200){
        alert('Request accepted/declined Suceessfully')
        window.location.reload()
      }
      else{
        alert('error')
      }

    }
    
  return (
    <div className='requestpanel'>
      <h1 className='text-center'>All Requests</h1>
      <hr></hr><br></br>
      <div className='table-container'>
        {requests.length === 0 ? (
          <h2 className='text-center'>Nothing yet</h2>
          ):(
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Book Title</th>
                <th scope="col">Requested User Name</th>
                <th scope="col">Requested User Email</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((requests) => (
                <tr key={requests.requestid}>
                  <td>{requests.title}</td>
                  <td>{requests.user_name}</td>
                  <td>{requests.user_email}</td>
                  <td><button className='btn btn-success' onClick={()=>requeststatus(requests.requestid,'Accepted')}>Accept</button> <button className='btn btn-danger' onClick={()=>requeststatus(requests.requestid,'Declined')}>Decline</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br></br><br></br>
        <h2 className='text-center'>Request History</h2>
        <hr></hr><br></br>
        {requestsHistory.length === 0 ? (
          <h2 className='text-center'>Nothing yet</h2>
          ):(
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Book Title</th>
                  <th scope="col">Requested User Name</th>
                  <th scope="col">Requested User Email</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
                <tbody>
                  {requestsHistory.map((requestsHistory) => (
                    <tr key={requestsHistory.title}>
                      <td>{requestsHistory.title}</td>
                      <td>{requestsHistory.user_name}</td>
                      <td>{requestsHistory.user_email}</td>
                      <td>{requestsHistory.status}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
      </div>
    </div>
  )
}

export default Requests