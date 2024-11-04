import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [user_password, setUser_password] = useState("")
  const [confirm_password, setConfirm_password] = useState("")
  const [contact, setContact] = useState("")
  const [profile, setProfile] = useState(null)

  async function handleSubmit(e){

    e.preventDefault()

    const formData = new FormData();

    formData.append("username",username)
    formData.append("email",email)
    formData.append("user_password",user_password)
    formData.append("confirm_password",confirm_password)
    formData.append("contact", contact)
    formData.append("profile", profile)
    formData.append("isVendor",false)

    try {
      const response = await axios.post("/api/v1/users/register", formData, 
        {
          withCredentials:true
        })
  
      console.log(response.data);
  
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-black py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Online Bookstore</h1>
          <div className="space-x-6">
            <Link to="/" className="book-link">Home</Link>
            <Link to="/register" className="book-link">Register</Link>
            <Link to="/login" className="book-link">Login</Link>
            <a href="#contact" className="book-link">Contact</a>
            <a href="#help" className="book-link">Help</a>
          </div>
        </div>
      </nav>

      {/* Register Form Section with Background Image */}
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>

        <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Create Your Account</h2>
          <p className="text-gray-300 mb-6">Join us to explore and save your favorite books.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Your Name" 
              name='customer_username'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setUsername(e.target.value) }
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              name='customer_email'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setEmail(e.target.value) }
            />
            <input 
              type="password" 
              placeholder="Password" 
              name='customer_password'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setUser_password(e.target.value) }
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              name='confirm_password'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setConfirm_password(e.target.value) }
            />
            <input 
              type="text" 
              placeholder="Contact Number" 
              name='customer_contact'
              className="w-full p-3 rounded bg-gray-700 text-white"
              onChange={ (e) => setContact(e.target.value) }
            />
            {/* Custom file upload styling */}
            <label className="w-full flex flex-col items-center px-4 py-3 bg-gray-700 text-white rounded cursor-pointer">
            <span>Upload Profile Image</span>
            <input 
              type="file" 
              name="profile"
              className="hidden" 
              onChange={(e) => setProfile(e.target.files[0])} // use files[0] for file object
            />
          </label>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-gray-400 mt-4">
            Already have an account? 
            <Link to="/login" className="text-blue-300 hover:underline ml-1">Login here</Link>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
