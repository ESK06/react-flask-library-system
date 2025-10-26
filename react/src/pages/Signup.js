import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/signup.css'

function Signup() {

    const[data,setData] = useState({
        name:'',
        email:'',
        password:''
    })
    const navigate = useNavigate()

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
            //console.log(result)

            if (result.message === 'success' && response.status === 201){
                alert('Account Created. Please Login')
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
        <div className='d-flex justify-content-center align-item-center bg-primary vh-100'>
            <div className='signup-form-container bg-white p-3 rounded w-25'>
                <h1 className='align-item-center'>Sign up</h1>
                <form name='signupform' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' name='name' className='field form-control rounded-0' required
                        onChange={handleInput}></input>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' className='field form-control rounded-0' required
                        onChange={handleInput}></input>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' className='field form-control rounded-0' required
                        onChange={handleInput}></input>
                    </div>
                    <button type='submit' className='btn btn-success'>Create Account</button>
                </form>
                <br></br>
                <Link to='/' type='button' className='btn btn-dark'>Login</Link>
            </div>
        </div>
    )
}

export default Signup