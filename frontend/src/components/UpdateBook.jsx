import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from './Nav.jsx'

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

const UpdateBook = () => {

  const { id } = useParams()

  useEffect(() => {
      async function update() {
      const res = await axios.get(`/api/v1/books/${id}`)
      const data = res.data
      console.log(data)
    }
    update()
  }, []);
    
  const [title, setTitle] = useState(data.title)
  const [genre, setGenre] = useState(data.genre)
  const [author, setAuthor] = useState(data.author)
  const [plot, setPlot] = useState(data.plot)
  const [book_price, setBook_price] = useState(data.price)
  const [copies, setCopies] = useState(data.copies)

  async function handleSubmit(e){

    e.preventDefault()

    try {
      // console.log("FORM DATA", formData)
      const response = await axios.put(`/api/v1/books/${id}`, { title, author, genre, plot, book_price, copies })
      console.log(response.data);
  
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>

      {/* Register Form Section with Background Image */}
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>

        <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
          <nav className="bg-gray py-6 shadow-md">
          <div className="container mx-auto flex justify-between items-center px-6">
            <div className="space-x-6">
            </div>
          </div>
        </nav>
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Add a New Book</h2>
          <p className="text-gray-300 mb-6">Post your books here!</p>

          <form className="space-y-4" onSubmit={handleSubmit} method='POST'>
            <input 
              type="text" 
              placeholder="Title" 
              name='title'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setTitle(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Author" 
              name='author'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setAuthor(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Genre" 
              name='genre'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setGenre(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Plot" 
              name='plot'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setPlot(e.target.value) }
            />
            <input 
              type="number" 
              placeholder="Price" 
              name='book_price'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setBook_price(e.target.value) }
            />
            <input 
              type="number" 
              placeholder="Copies" 
              name='copies'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setCopies(e.target.value) }
            />
            
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Update
            </button>
          </form>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UpdateBook;