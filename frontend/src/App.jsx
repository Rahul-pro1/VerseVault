import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import BookSearch from './components/BookSearch'
import Cart from './components/Cart'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MyContext } from "./MyContext";
import { useState } from 'react'

export default function App() {
  const [username, setUsername] = useState("")
  return (
    <>
      <MyContext.Provider value={{ username, setUsername }}>
      <Router>
      <Routes>
        <Route path="/search" element={<BookSearch/>}/>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
      </Routes>
      </Router>
      </MyContext.Provider>
    </>
  )
}