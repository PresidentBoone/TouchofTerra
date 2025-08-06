import React, { useState } from 'react';

const DonationForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [isMonthly, setIsMonthly] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Here you would typically handle the payment processing with Stripe or another service
        try {
            // Simulate a successful donation process
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess(true);
        } catch (err) {
            setError('There was an error processing your donation. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
            {success && <p className="text-green-500 mb-4">Thank you for your generous donation!</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full border rounded-md p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full border rounded-md p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Donation Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="mt-1 block w-full border rounded-md p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={isMonthly}
                            onChange={() => setIsMonthly(!isMonthly)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Make this a monthly donation</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition duration-200"
                >
                    Donate
                </button>
            </form>
        </div>
    );
};

export default DonationForm;