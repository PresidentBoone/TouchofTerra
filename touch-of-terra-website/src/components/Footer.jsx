import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-teal-600 text-white py-4 mt-10">
            <div className="container mx-auto text-center">
                <p className="mb-2">© {new Date().getFullYear()} Touch of Terra. All rights reserved.</p>
                <div className="flex justify-center space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;