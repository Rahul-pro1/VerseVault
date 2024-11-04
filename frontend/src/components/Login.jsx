import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-black py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">VerseVault</h1>
          <div className="space-x-6">
            <Link to="/" className="book-link">Home</Link>
            <Link to="/register" className="book-link">Register</Link>
            <Link to="/login" className="book-link">Login</Link>
            <a href="#contact" className="book-link">Contact</a>
            <a href="#help" className="book-link">Help</a>
          </div>
        </div>
      </nav>

      {/* Login Form Section with Background Image */}
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>

        <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-purple-300">Welcome Back</h2>
          <p className="text-gray-300 mb-6">Log in to access your account and explore your favorite books.</p>

          <form className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-gray-400 mt-4">
            Don’t have an account? 
            <Link to="/register" className="text-blue-300 hover:underline ml-1">Register here</Link>.
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

export default Login;
