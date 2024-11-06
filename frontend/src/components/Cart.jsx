import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import Nav from './Nav';

const Cart = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin(e){

    e.preventDefault()

    const loginInfo={
      "username":username,
      "password":password
    }

    try {
      const response = await axios.post("/api/v1/users/login", loginInfo, 
        {
          withCredentials:true
        }
      )
  
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >

      </section>
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
