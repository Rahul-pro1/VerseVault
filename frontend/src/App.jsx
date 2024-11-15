import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import BookSearch from './components/BookSearch'
import Cart from './components/Cart'
import View from './components/View'
import NewBook from './components/NewBook'
import UpdateBook from './components/UpdateBook'
import Recommend from './components/Recommend'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MyContext } from './MyContext'
import { useState } from 'react'
import Vendors from './components/Vendors'
import ViewBooks from './components/ViewBooks'

export default function App() {
  const [user, setUser] = useState({})

  return (
    <MyContext.Provider value={{ user, setUser }}>
      <Router>
      <Routes>
        <Route path="/search" element={<BookSearch/>}/>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/viewBook' element={<ViewBooks/>}/>
        <Route path='/view/:id' element={<View/>}/>
        <Route path='/new' element={<NewBook/>}/>
        <Route path='/update/:id' element={<UpdateBook/>}/>
        <Route path='/recommend' element={<Recommend/>}/>
        <Route path='/vendors' element={<Vendors/>}/>
        {/* <Route path='/review/:id' element={<Review/>}/> */}
      </Routes>
      </Router>
    </MyContext.Provider>
  )
}