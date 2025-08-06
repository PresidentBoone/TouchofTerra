import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../public/images/logo.png';

const Navbar = () => {
    return (
        <nav className="sticky top-0 bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
            <Link to="/">
                <img src={logo} alt="Touch of Terra Logo" className="h-10" />
            </Link>
            <div className="flex space-x-4">
                <Link to="/" className="text-teal-600 hover:text-teal-800">Home</Link>
                <Link to="/about" className="text-teal-600 hover:text-teal-800">About</Link>
                <Link to="/donate" className="text-teal-600 hover:text-teal-800">Donate</Link>
                <div className="relative">
                    <button className="text-teal-600 hover:text-teal-800 focus:outline-none">
                        More
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block">
                        <Link to="/contact" className="block px-4 py-2 text-teal-600 hover:bg-teal-100">Contact</Link>
                        <Link to="/volunteer" className="block px-4 py-2 text-teal-600 hover:bg-teal-100">Volunteer</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;