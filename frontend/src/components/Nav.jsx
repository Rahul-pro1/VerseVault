import { Link } from "react-router-dom";

const Nav = () => {

    return (
        <nav className="bg-black py-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold">VerseVault</h1>
            <div className="space-x-6">
                <Link to="/" className="book-link">Home</Link>
                <Link to="/register" className="book-link">Register</Link>
                <Link to="/login" className="book-link">Login</Link>
                <Link to="/search" className="book-link">Search</Link>
                <Link to="/cart" className="book-link">Cart</Link>
            </div>
            </div>
        </nav>
    )
    };

export default Nav;