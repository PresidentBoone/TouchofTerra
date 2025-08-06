import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-teal-600 mb-4">Contact Us</h1>
            <p className="mb-6">
                We would love to hear from you! If you have any questions, comments, or would like to get involved, please fill out the form below.
            </p>
            <ContactForm />
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-teal-600">Get in Touch</h2>
                <p className="mt-2">Email: <a href="mailto:hello@touchofterra.org" className="text-blue-500">hello@touchofterra.org</a></p>
                <p>Phone: <span className="text-gray-700">(502) 123-4567</span></p>
                <p>Location: <span className="text-gray-700">Louisville, KY</span></p>
            </div>
            {/* Optional: Embed Google Map here */}
        </div>
    );
};

export default Contact;