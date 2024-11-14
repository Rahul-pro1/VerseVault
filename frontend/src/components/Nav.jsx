import { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../MyContext";

const Nav = () => {
    const { user, setUser } = useContext(MyContext)
    console.log(user)
    return (
        <nav className="bg-black py-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold">VerseVault</h1>
            <div className="space-x-6">
                <Link to="/" className="book-link">Home</Link>
                <Link to="/register" className="book-link">Register</Link>
                <Link to="/login" className="book-link">Login</Link>
                {(user != {}) ? <Link to="/search" className="book-link">Search</Link> : <></>}
                {(user.role == "customer") ? <Link to="/cart" className="book-link">Cart</Link> : <></>}
                {(user.role == "customer") ? <Link to="/recommend" className="book-link">Recommended</Link> : <></>}
                {(user.role == "vendor") ? <Link to="/new" className="book-link">Add Book</Link> : <></>}
            </div>
            </div>
        </nav>
    )
    };

export default Nav;