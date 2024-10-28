import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-black py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Online Bookstore</h1>
          <div className="space-x-6">
            <Link to="/register" className="book-link">Register</Link>
            <Link to="/login" className="book-link">Login</Link>
            <a href="#contact" className="book-link">Contact</a>
            <a href="#help" className="book-link">Help</a>
          </div>
        </div>
      </nav>

      {/* Enlarged Header Section with Background Image */}
      <header 
        className="h-screen bg-cover bg-center flex items-center justify-center text-center py-32 relative"
        style={{ backgroundImage: `url('/library.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-800 opacity-70"></div>
        <div className="relative z-10">
          <h2 className="text-6xl md:text-7xl font-bold mb-4">Discover Your Next Great Read</h2>
          <p className="text-xl text-gray-300 mb-8">Explore a world of stories and knowledge at your fingertips.</p>
          <a href="#contact" className="bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 book-link">
            Contact Us
          </a>
        </div>
      </header>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-800 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-purple-300 mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-6">We’d love to hear from you! Reach out to us for any questions or support.</p>
          <form className="space-y-4 max-w-md mx-auto">
            <input type="text" placeholder="Your Name" className="w-full p-3 rounded bg-gray-700 text-white" />
            <input type="email" placeholder="Your Email" className="w-full p-3 rounded bg-gray-700 text-white" />
            <textarea placeholder="Your Message" className="w-full p-3 rounded bg-gray-700 text-white h-32"></textarea>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Help Section */}
      <section id="help" className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-semibold text-center text-purple-300 mb-4">Help</h2>
        <p className="text-gray-300 text-center max-w-2xl mx-auto">
          Find answers to common questions, get guidance on book selections, and learn more about using our bookstore.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
