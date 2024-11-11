import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import BookSearch from './components/BookSearch'
import Cart from './components/Cart'
import View from './components/View'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewBook from './components/NewBook'

export default function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/search" element={<BookSearch/>}/>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/view/:id' element={<View/>}/>
        <Route path='/new' element={<NewBook/>}/>
      </Routes>
      </Router>
    </>
  )
}