import React, { useState } from 'react';

const MINIMUM_QUANTITY = 500;

const wishlistItems = [
    { name: 'Toothbrush', icon: '🪥', category: 'Hygiene', currentStock: 120, needed: MINIMUM_QUANTITY },
    { name: 'Toothpaste (travel size)', icon: '🦷', category: 'Hygiene', currentStock: 85, needed: MINIMUM_QUANTITY },
    { name: 'Deodorant (travel size)', icon: '💨', category: 'Hygiene', currentStock: 200, needed: MINIMUM_QUANTITY },
    { name: 'Bar of Soap', icon: '🧼', category: 'Hygiene', currentStock: 310, needed: MINIMUM_QUANTITY },
    { name: 'Soap Box', icon: '📦', category: 'Hygiene', currentStock: 95, needed: MINIMUM_QUANTITY },
    { name: 'Toilet Paper', icon: '🧻', category: 'Hygiene', currentStock: 50, needed: MINIMUM_QUANTITY },
    { name: 'Washcloth', icon: '🧽', category: 'Hygiene', currentStock: 180, needed: MINIMUM_QUANTITY },
    { name: 'Wet Wipes', icon: '🧴', category: 'Hygiene', currentStock: 240, needed: MINIMUM_QUANTITY },
    { name: 'Scarf', icon: '🧣', category: 'Warmth', currentStock: 75, needed: MINIMUM_QUANTITY },
    { name: 'Gloves', icon: '🧤', category: 'Warmth', currentStock: 60, needed: MINIMUM_QUANTITY },
    { name: 'Beanie Hat', icon: '👒', category: 'Warmth', currentStock: 90, needed: MINIMUM_QUANTITY },
    { name: 'Socks', icon: '🧦', category: 'Warmth', currentStock: 150, needed: MINIMUM_QUANTITY },
    { name: 'Dum Dums (Candy)', icon: '🍭', category: 'Comfort', currentStock: 420, needed: MINIMUM_QUANTITY },
    { name: 'Protein Bar', icon: '🍫', category: 'Nutrition', currentStock: 280, needed: MINIMUM_QUANTITY },
    { name: 'Blue Drawstring Backpack', icon: '🎒', category: 'Container', currentStock: 45, needed: MINIMUM_QUANTITY },
    { name: 'Reusable Water Bottle', icon: '💧', category: 'Essentials', currentStock: 110, needed: MINIMUM_QUANTITY },
    { name: 'Comb', icon: '💈', category: 'Hygiene', currentStock: 205, needed: MINIMUM_QUANTITY },
    { name: 'First Aid Supplies', icon: '🩹', category: 'Health', currentStock: 130, needed: MINIMUM_QUANTITY }
];

const SuppliesWishlist = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('urgency'); // urgency, name, category

    const categories = ['All', 'Hygiene', 'Warmth', 'Comfort', 'Nutrition', 'Essentials', 'Health', 'Container'];

    // Filter items
    let filteredItems = selectedCategory === 'All'
        ? wishlistItems
        : wishlistItems.filter(item => item.category === selectedCategory);

    // Sort items
    if (sortBy === 'urgency') {
        filteredItems = [...filteredItems].sort((a, b) => {
            const urgencyA = (a.needed - a.currentStock) / a.needed;
            const urgencyB = (b.needed - b.currentStock) / b.needed;
            return urgencyB - urgencyA; // Most urgent first
        });
    } else if (sortBy === 'name') {
        filteredItems = [...filteredItems].sort((a, b) => a.name.localeCompare(b.name));
    }

    const getUrgencyLevel = (item) => {
        const percentage = (item.currentStock / item.needed) * 100;
        if (percentage < 20) return { level: 'Critical', color: '#DC2626', bg: '#FEE2E2' };
        if (percentage < 40) return { level: 'Low', color: '#EA580C', bg: '#FED7AA' };
        if (percentage < 70) return { level: 'Medium', color: '#CA8A04', bg: '#FEF3C7' };
        return { level: 'Good', color: '#7BA05B', bg: '#D1FAE5' };
    };

    const totalItemsNeeded = wishlistItems.reduce((sum, item) => sum + (item.needed - item.currentStock), 0);
    const criticalItems = wishlistItems.filter(item => (item.currentStock / item.needed) < 0.2).length;

    return (
        <section className="py-12" aria-labelledby="wishlist-heading">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 id="wishlist-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                    Supplies Wishlist
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    We need at least <span className="font-bold" style={{ color: '#7BA05B' }}>500 of each item</span> to maintain our distribution schedule. Currently accepting <span className="font-bold">monetary donations only</span>.
                </p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#7BA05B' }}>
                        {totalItemsNeeded.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Items Needed</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#DC2626' }}>
                        {criticalItems}
                    </div>
                    <div className="text-sm text-gray-600">Critical Items (\u003c20% stock)</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#7BA05B' }}>
                        {MINIMUM_QUANTITY}
                    </div>
                    <div className="text-sm text-gray-600">Minimum per Item</div>
                </div>
            </div>

            {/* Important Notice */}
            <div className="mb-8 p-6 rounded-xl text-center" style={{
                background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)',
                color: 'white'
            }}>
                <h3 className="text-2xl font-bold mb-3">💰 Monetary Donations Only</h3>
                <p className="text-lg mb-4 max-w-2xl mx-auto">
                    We currently accept monetary donations only. This allows us to purchase supplies in bulk at discounted rates, ensuring every dollar has maximum impact.
                </p>
                <button
                    className="px-8 py-3 bg-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ color: '#7BA05B' }}
                    onClick={() => window.location.href = '/donate.html?amount=35'}
                >
                    Donate to Fund Supplies
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                    ? 'text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            style={selectedCategory === category ? {
                                background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
                            } : {}}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
                    >
                        <option value="urgency">Urgency</option>
                        <option value="name">Name</option>
                        <option value="category">Category</option>
                    </select>
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
                {filteredItems.map((item, index) => {
                    const urgency = getUrgencyLevel(item);
                    const percentage = Math.min((item.currentStock / item.needed) * 100, 100);
                    const stillNeeded = Math.max(item.needed - item.currentStock, 0);

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-center gap-6">
                                {/* Icon */}
                                <div className="text-4xl">{item.icon}</div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold" style={{ color: '#2D3E35' }}>
                                                {item.name}
                                            </h3>
                                            <span className="text-xs px-2 py-1 rounded-full" style={{
                                                backgroundColor: urgency.bg,
                                                color: urgency.color,
                                                fontWeight: '600'
                                            }}>
                                                {urgency.level} Priority
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Current Stock</div>
                                            <div className="text-2xl font-bold" style={{ color: urgency.color }}>
                                                {item.currentStock}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Progress to {item.needed} minimum</span>
                                            <span>{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: urgency.color
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Still Needed */}
                                    <div className="text-sm flex items-center gap-2">
                                        <span className="text-gray-600">Still need:</span>
                                        <span className="font-bold" style={{ color: urgency.color }}>
                                            {stillNeeded} more
                                        </span>
                                        <span className="text-gray-500">
                                            (${(stillNeeded * 0.5).toFixed(2)} estimated cost)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center p-8 rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.1), rgba(93, 138, 122, 0.1))',
                border: '2px solid #7BA05B'
            }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                    Help Us Stock Up!
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Your donation helps us purchase these essential items in bulk. Every dollar goes directly toward supplies that provide comfort and dignity.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        className="px-8 py-3 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                        onClick={() => window.location.href = '/donate.html?amount=100'}
                    >
                        Donate $100 (Funds ~200 items)
                    </button>
                    <button
                        className="px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2"
                        style={{ borderColor: '#7BA05B', color: '#7BA05B', backgroundColor: 'white' }}
                        onClick={() => window.location.href = '/donate.html'}
                    >
                        Choose Your Amount
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SuppliesWishlist;
