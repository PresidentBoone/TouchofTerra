import React from 'react';
import DonationForm from '../components/DonationForm';

const Donate = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <h1 className="text-3xl font-bold text-teal-600 mb-6">Support Touch of Terra</h1>
            <p className="text-lg text-gray-700 mb-4">
                Your generous donations help us provide essential backpacks filled with food, toiletries, and other necessities for those in need.
            </p>
            <DonationForm />
            <div className="mt-8 text-center">
                <p className="text-gray-600">Thank you for your support!</p>
            </div>
        </div>
    );
};

export default Donate;