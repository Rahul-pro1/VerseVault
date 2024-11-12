import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import BookSearch from './components/BookSearch'
import Cart from './components/Cart'
import View from './components/View'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import { MyContext } from "./MyContext";
import { useState } from 'react'

export default function App() {
  const [username, setUsername] = useState("")
  return (
    <>
      <MyContext.Provider value={{ username, setUsername }}>
=======
import NewBook from './components/NewBook'
import { MyContext } from './MyContext'

export default function App() {
  const [user, setUser] = useState({})

  return (
    <MyContext.Provider value={{ user, setUser }}>
>>>>>>> 2c79453b92f4693bbd21a6f2c98433f35d83ea7b
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
<<<<<<< HEAD
      </MyContext.Provider>
    </>
=======
    </MyContext.Provider>
>>>>>>> 2c79453b92f4693bbd21a6f2c98433f35d83ea7b
  )
}