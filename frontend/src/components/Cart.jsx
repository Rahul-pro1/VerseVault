import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './Nav';

const Cart = () => {
  const [books, setBooks] = useState([]);
  const [address, setAddress] = useState('');
  const [modeOfPayment, setModeOfPayment] = useState(''); // e.g., "credit_card", "paypal"
  const [paymentStatus, setPaymentStatus] = useState('pending'); // Default to 'pending'

  useEffect(() => {
    async function getCart() {
      try {
        const res = await axios.get('/api/v1/users/shopping');
        console.log('books', res.data);
        setBooks(res.data || []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks([]);
      }
    }
    getCart();
  }, []);

  const buyBooks = async () => {
    if (!address || !modeOfPayment || books.length === 0) {
      alert('Please ensure all required information is filled and you have books in your cart.');
      return;
    }

    try {
      const res = await axios.post('/api/v1/books/buy', {
        address,
        mode_of_payment: modeOfPayment,
        payment_status: paymentStatus,
      });

      console.log('Order placed successfully:', res.data);
      alert('Order placed successfully!');

      // Clear the cart upon successful order
      setBooks([]);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Nav />
      <section
        className="flex-grow flex items-center justify-center text-center py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/library.jpg')` }}
      >
        {books.length > 0 ? (
          <div className="mt-8 max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <ul>
                {books.map((book) => (
                  <li key={book.book_id} className="flex py-6 border-b">
                    <div className="shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        alt={book.title}
                        src={book.book_cover}
                        className="w-24 h-24 object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <h3 className="text-lg font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.genre}</p>
                      </div>
                      <p className="text-sm text-gray-500">{book.vendor_username}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <div className="flex flex-col mb-4">
                  <label htmlFor="address" className="text-left mb-2 font-medium">
                    Delivery Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="modeOfPayment" className="text-left mb-2 font-medium">
                    Mode of Payment:
                  </label>
                  <select
                    id="modeOfPayment"
                    value={modeOfPayment}
                    onChange={(e) => setModeOfPayment(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="" disabled>
                      Select payment mode
                    </option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="net_banking">Net Banking</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={buyBooks}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No books found in your cart.</p>
        )}
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Online Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
