import React, {useContext, createContext, useState} from 'react'

const authcontext = createContext()

export function AuthProvider({children}) {

    const [token, setToken] = useState(localStorage.getItem('access_token'))

    const login = (newToken) => {
        localStorage.setItem('access_token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        setToken(null)
    }

  return (
    <authcontext.Provider value={{token, login, logout}}>
        {children}
    </authcontext.Provider>
    
  )
}

export function useAuth(){
    return useContext(authcontext)
}