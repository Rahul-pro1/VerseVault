'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import Nav from './Nav'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function View() {
  const [book, setBook] = useState({})
  const id = useParams()

  useEffect(async () => {
    try {
      const res = await axios.get(`/api/v1/books/${ id }`)
      console.log(res.data)
      setBook(res.data)
    } catch (err) {
      console.log(err)
    }
  }, [])

  const handleSubmit = async (evt) => {
    try {
      evt.preventDefault()
      const res = await axios.post('/api/v1/users/shopping', { book_id: id })
      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-white">
      <Nav/>
      <section 
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative" // Replace with correct path to your uploaded image
      >
      <div className="pt-6 ">
        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{book.title}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">{book.book_price}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10" method='POST' onSubmit = { handleSubmit }>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                // alt={product.images[1].alt}
                src={book.book_cover}
                className="h-full w-full object-cover object-center"
              />
            </div>
              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
            </form>
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
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                {book.genre}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              {/* <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  )
}