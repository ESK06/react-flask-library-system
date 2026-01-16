import React, {useContext, createContext, useState} from 'react'
import {jwtDecode} from 'jwt-decode'

const authcontext = createContext()

export function AuthProvider({children}) {

    const [token, setToken] = useState(localStorage.getItem('access_token'))

    const login = (newToken) => {
        localStorage.setItem('access_token', newToken)
        setToken(newToken)
    }

    const getAdmin = () => {
        try{
            return jwtDecode(token).isAdmin === true
        }
        catch (error){
            return false
        }

    }

    const logout = () => {
        localStorage.removeItem('access_token')
        setToken(null)
    }

  return (
    <authcontext.Provider value={{token, isAdmin:getAdmin(), login, logout}}>
        {children}
    </authcontext.Provider>
    
  )
}

export function useAuth(){
    return useContext(authcontext)
}