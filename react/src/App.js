import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Myprofile from './pages/Myprofile'
import Browse from './pages/Browse'
import Bookdetails from './pages/Bookdetails'
import History from './pages/History'
import Wishlist from './pages/Wishlist'
import Results from './pages/Results'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>

        <Route element={<Layout />}>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/profile' element={<Myprofile />}></Route>
          <Route path='/results' element={<Results />}></Route>
          <Route path='/browse' element={<Browse />}></Route>
          <Route path='/browse/:id' element={<Bookdetails />}></Route>
          <Route path='/history' element={<History />}></Route>
          <Route path='/wishlist' element={<Wishlist />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App