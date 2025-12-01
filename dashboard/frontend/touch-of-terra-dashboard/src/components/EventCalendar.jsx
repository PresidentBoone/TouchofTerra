import React, { useState } from 'react';

const EventCalendar = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // TODO: Connect to email service (Mailchimp, SendGrid, etc.)
            console.log('Email signup:', email);
            setSubscribed(true);
            setEmail('');

            // Reset after 3 seconds
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <section className="py-12" aria-labelledby="events-heading">
            <div className="max-w-2xl mx-auto text-center">
                {/* Header */}
                <div className="mb-8">
                    <h2 id="events-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                        Upcoming Events
                    </h2>
                    <p className="text-lg text-gray-600">
                        Be the first to know about Touch of Terra events, backpack distributions, and volunteer opportunities.
                    </p>
                </div>

                {/* Email Signup Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    {!subscribed ? (
                        <>
                            <div className="text-6xl mb-6">📅</div>
                            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                                Stay in the Loop
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Get notified when we schedule new events in your area
                            </p>

                            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-green-500"
                                        style={{ borderColor: '#D4C5A0' }}
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                        style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                                    >
                                        Notify Me
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: '#7BA05B' }}>
                                You're all set!
                            </h3>
                            <p className="text-gray-600">
                                We'll notify you about upcoming events
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-6 rounded-xl" style={{
                    background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.1), rgba(93, 138, 122, 0.1))',
                    border: '2px solid #7BA05B'
                }}>
                    <p className="text-gray-700">
                        <strong>Want to host an event?</strong> Schools, churches, and businesses can partner with us to organize backpack assembly events or distribution drives.{' '}
                        <a
                            href="/contact.html"
                            className="font-bold hover:underline"
                            style={{ color: '#7BA05B' }}
                        >
                            Contact us →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default EventCalendar;
