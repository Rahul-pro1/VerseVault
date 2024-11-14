import axios from "axios";
import React, { useState } from "react";
import Nav from "./Nav";

function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    setBooks([]);      // Clear previous results

    const query = new FormData()

    query.append("query", query)
    // let str_array = query.split(" ");
    // let empty = str_array.join("+").toLowerCase();

    try {
      let response = await axios.get('/api/v1/books/', query);
      let booksData = response.data
      console.log("BOOK DATA", response)
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with correct path to your uploaded image
      >
    <div className="flex flex-col items-center justify-center min-h-screen bg-center bg-[url('/search.jpg')]">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-80"></div>
      <div className="relative z-10 text-center text-white p-8">
        <h2 className="text-3xl font-bold mb-4">Find Your Next Book</h2>
        <p className="text-gray-300 mb-8">
          Discover a world of books by searching for your favorite title or author.
        </p>

        <form onSubmit={handleSearch} className="flex space-x-2 pl-28">
          <input
            type="text"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded-lg focus:outline-none w-64 text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="mt-8">
            {/* Loading spinner */}
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="mt-8 max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-black">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="p-2">Cover</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Author</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-64 block">
                {books.map((book, index) => (
                  <tr key={index} className="bg-gray-100 text-left">
                    <td className="p-2">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-16 h-20 object-cover" />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="p-2">{book.title}</td>
                    <td className="p-2">{book.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </section>
    </div>
  );
}

export default BookSearch;
