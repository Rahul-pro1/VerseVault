'use client'

import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Nav from './Nav'
import { MyContext } from '../MyContext'
import { StarIcon } from '@heroicons/react/20/solid'

axios.defaults.withCredentials = true;

export default function View() {
  const [book, setBook] = useState({})
  const { id } = useParams()
  const { user, setUser } = useContext(MyContext)
  const navigate = useNavigate()

  console.log("id", id)

  useEffect(() => {
    async function viewBook() {
      const res = await axios.get(`/api/v1/books/${ id }`)
      console.log(res.data)
      setBook(res.data)
    }
    viewBook()
  }, [])

  const handleSubmit = async (evt) => {
    try {
      evt.preventDefault()
      console.log("Book id", id)
      const res = await axios.post('/api/v1/users/shopping', { book_id: id, copies: 1 })
      navigate('/cart')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }} // Replace with the correct path to your image
      >
    <div className="bg-white">
    <div className="pt-6 ">
        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{book.title}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-xl tracking-tight text-gray-900"><strong>Price: </strong>{book.book_price}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((index) => (
                  <StarIcon
                    key={index}
                    aria-hidden="true"
                    className={`h-5 w-5 ${
                      index <= book.avg_rating ? 'text-indigo-600' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className='text-gray-900'>{book.avg_rating} out of 5 stars</p>
              </div>
            </div>
          {
            user.role === "customer" ? (
              <form className="mt-10" method="POST" onSubmit={handleSubmit}>
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                  <img
                    src={book.book_cover}
                    className="h-full w-full object-cover object-center"
                    alt="Book cover"
                  />
                </div>
                <button
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Link to={`/review/${ id }`} className='text-white'>Add review</Link>
                </button>
                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to Cart
                </button>
              </form>
            ) : (
              <form className="mt-10">
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                  <img
                    src={book.book_cover}
                    className="h-full w-full object-cover object-center"
                    alt="Book cover"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Link to={`/update/${book.book_id}`} className='text-white'>Update</Link>
                </button>
              </form>
            )
          }

          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{book.plot}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Genre</h3>

              <div className="mt-4">
                <p className="text-base text-gray-900">{book.genre}</p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Reviews</h2>
              <ul role="list" className="divide-y divide-gray-100">
              {book.reviews?.map((review) => (
                <li key={review.review_id} className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold text-gray-900">
                        {review.customer_username}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {review.content}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm text-gray-900">{review.rating} / 5</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <StarIcon
                          key={index}
                          aria-hidden="true"
                          className={`h-5 w-5 ${
                            index <= review.rating ? 'text-indigo-600' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            </div>
          </div>
        </div>
      </div>
      </div>
      </section>
    </div>
  )
}