import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'
import '../styles/login.css'

function Login() {

    const navigate = useNavigate()

    const[data,setData] = useState({
        email:'',
        password:'',
    })

    const {token, login, isAdmin} = useAuth()
    
    useEffect(() => {
        if (token){
            if (isAdmin) {
                navigate('/admin', { replace: true})
            }
            else{
            navigate('/home', {replace: true})
            }
        }
    }, [token, isAdmin, navigate])


    const handleInput = (event) => {
        setData(prev => ({...prev, [event.target.name]: event.target.value}))
    }


    const handleSubmit = async (event) => {
        event.preventDefault()
    

        try{
            const response = await fetch('/login/', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(data)

            })

            const result = await response.json()


            if (response.status === 200 && result.login) {
                //console.log(result)
                login(result.access_token)

            }
            else{
                
                //console.log(result.message)
                alert(result.message)
            }
            
        }
        catch(error){
            console.error('Fetch error:', error);
        }
    }    

    return (
        <div className='d-flex justify-content-center align-item-center bg-primary vh-100'>
            <div className=' login-form-container bg-white p-3 rounded w-25'>
                <h1 className='text-center'>Login</h1>
                <form name='loginform' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input id='email' type='email' name='email' className='field form-control rounded-0' required
                        onChange={handleInput}></input>
                        <label htmlFor='password'>Password</label>
                        <input id='password' type='password' name='password' className='field form-control rounded-0' required
                        onChange={handleInput}></input>
                    </div>
                    <button type='submit' className='btn btn-success'>Login</button>
                </form>
                <Link to='/signup' type='button' className='btn btn-dark'>Signup</Link>
            </div>
        </div>
    )
}

export default Login