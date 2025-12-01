import React, { useState } from 'react';

const backpackItems = [
    { name: 'Toothbrush', icon: '🪥', category: 'Hygiene' },
    { name: 'Toothpaste', icon: '🦷', category: 'Hygiene' },
    { name: 'Deodorant', icon: '💨', category: 'Hygiene' },
    { name: 'Bar of Soap', icon: '🧼', category: 'Hygiene' },
    { name: 'Soap Box', icon: '📦', category: 'Hygiene' },
    { name: 'Toilet Paper', icon: '🧻', category: 'Hygiene' },
    { name: 'Washcloth', icon: '🧽', category: 'Hygiene' },
    { name: 'Wet Wipes', icon: '🧴', category: 'Hygiene' },
    { name: 'Scarf', icon: '🧣', category: 'Warmth' },
    { name: 'Gloves', icon: '🧤', category: 'Warmth' },
    { name: 'Beanie Hat', icon: '👒', category: 'Warmth' },
    { name: 'Socks', icon: '🧦', category: 'Warmth' },
    { name: 'Dum Dums (Candy)', icon: '🍭', category: 'Comfort' },
    { name: 'Protein Bar', icon: '🍫', category: 'Nutrition' },
    { name: 'Blue Drawstring Backpack', icon: '🎒', category: 'Container' },
    { name: 'Reusable Water Bottle', icon: '💧', category: 'Essentials' },
    { name: 'Comb', icon: '💈', category: 'Hygiene' },
    { name: 'First Aid Supplies', icon: '🩹', category: 'Health' }
];

const BackpackBreakdown = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Hygiene', 'Warmth', 'Comfort', 'Nutrition', 'Essentials', 'Health', 'Container'];

    const filteredItems = activeCategory === 'All'
        ? backpackItems
        : backpackItems.filter(item => item.category === activeCategory);

    return (
        <section className="py-12" aria-labelledby="backpack-heading">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 id="backpack-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                    What's in a Backpack?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Each backpack costs <span className="font-bold text-green-700">$35</span> and contains 18 essential items to help someone experiencing homelessness. Your donation provides dignity, comfort, and basic necessities.
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${activeCategory === category
                                ? 'text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        style={activeCategory === category ? {
                            background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
                        } : {}}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100"
                    >
                        {/* Icon */}
                        <div className="text-5xl mb-3 text-center">
                            {item.icon}
                        </div>

                        {/* Name */}
                        <h3 className="text-sm font-semibold text-center mb-2" style={{ color: '#2D3E35' }}>
                            {item.name}
                        </h3>

                        {/* Category Badge */}
                        <div className="text-center">
                            <span
                                className="inline-block px-2 py-1 text-xs rounded-full"
                                style={{
                                    backgroundColor: getCategoryColor(item.category),
                                    color: 'white'
                                }}
                            >
                                {item.category}
                            </span>
                        </div>

                        {/* Touch of Terra Logo Watermark */}
                        <div className="mt-2 text-xs text-gray-400 text-center">
                            Touch of Terra
                        </div>
                    </div>
                ))}
            </div>

            {/* Impact Statement */}
            <div className="mt-12 text-center p-8 rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.1), rgba(93, 138, 122, 0.1))',
                border: '2px solid #7BA05B'
            }}>
                <p className="text-xl font-semibold mb-4" style={{ color: '#2D3E35' }}>
                    <span className="text-3xl" style={{ color: '#7BA05B' }}>490</span> backpacks distributed so far
                </p>
                <p className="text-lg text-gray-700">
                    That's <span className="font-bold" style={{ color: '#5D8A7A' }}>8,820 items</span> bringing comfort and dignity to those in need.
                </p>
                <button
                    className="mt-6 px-8 py-3 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                    onClick={() => window.location.href = '/donate.html'}
                >
                    Sponsor a Backpack ($35)
                </button>
            </div>

            {/* Donation Tiers */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <DonationTierCard
                    amount={35}
                    items="1 backpack"
                    impact="Help 1 person"
                />
                <DonationTierCard
                    amount={175}
                    items="5 backpacks"
                    impact="Help 5 people"
                    featured
                />
                <DonationTierCard
                    amount={350}
                    items="10 backpacks"
                    impact="Help 10 people"
                />
            </div>
        </section>
    );
};

// Donation Tier Card Component
const DonationTierCard = ({ amount, items, impact, featured = false }) => (
    <div
        className={`p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${featured ? 'shadow-2xl border-4' : 'shadow-lg border-2 border-gray-200'
            }`}
        style={featured ? {
            background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)',
            borderColor: '#7BA05B',
            color: 'white'
        } : {
            background: 'white'
        }}
    >
        {featured && (
            <div className="mb-2 text-xs font-bold uppercase tracking-wide">
                Most Popular
            </div>
        )}
        <div className={`text-4xl font-bold mb-2 ${featured ? 'text-white' : ''}`} style={!featured ? { color: '#7BA05B' } : {}}>
            ${amount}
        </div>
        <div className={`text-lg font-semibold mb-2 ${featured ? 'text-white' : 'text-gray-700'}`}>
            {items}
        </div>
        <div className={`text-sm mb-4 ${featured ? 'text-white/90' : 'text-gray-600'}`}>
            {impact}
        </div>
        <button
            className={`w-full py-2 px-4 rounded-full font-semibold transition-all duration-200 ${featured
                    ? 'bg-white hover:bg-gray-100'
                    : 'hover:bg-gray-50 border-2'
                }`}
            style={featured ? {
                color: '#7BA05B'
            } : {
                borderColor: '#7BA05B',
                color: '#7BA05B'
            }}
            onClick={() => window.location.href = `/donate.html?amount=${amount}`}
        >
            Donate ${amount}
        </button>
    </div>
);

// Helper function for category colors
const getCategoryColor = (category) => {
    const colors = {
        'Hygiene': '#5D8A7A',
        'Warmth': '#7BA05B',
        'Comfort': '#A8B89C',
        'Nutrition': '#6B7C73',
        'Essentials': '#2D3E35',
        'Health': '#9BC177',
        'Container': '#4A6B5D'
    };
    return colors[category] || '#7BA05B';
};

export default BackpackBreakdown;
