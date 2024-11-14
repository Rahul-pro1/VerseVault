import axios from "axios";
import React, { useState, useEffect } from "react";
import Nav from "./Nav";

function Recommend() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function recommend() {
        const res = await axios.get(`/api/v1/books/recommend`)
        console.log(res.data)
        setBooks(res.data)
    }
    recommend()
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
        { books }
    </section>
    </div>
  );
}

export default Recommend;
