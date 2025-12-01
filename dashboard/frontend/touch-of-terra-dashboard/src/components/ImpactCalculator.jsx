import React, { useState } from 'react';

const ImpactCalculator = () => {
    const [donationAmount, setDonationAmount] = useState(35);
    const BACKPACK_COST = 35;
    const ITEMS_PER_BACKPACK = 18;

    const backpacks = Math.floor(donationAmount / BACKPACK_COST);
    const totalItems = backpacks * ITEMS_PER_BACKPACK;
    const peopleHelped = backpacks;

    const presetAmounts = [35, 70, 175, 350, 500, 1000];

    const handleSliderChange = (e) => {
        setDonationAmount(parseInt(e.target.value));
    };

    const handlePresetClick = (amount) => {
        setDonationAmount(amount);
    };

    return (
        <section className="py-12" aria-labelledby="calculator-heading">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 id="calculator-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                        Impact Calculator
                    </h2>
                    <p className="text-lg text-gray-600">
                        See how your donation transforms into real impact
                    </p>
                </div>

                {/* Calculator Card */}
                <div
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                    style={{
                        background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.05), rgba(93, 138, 122, 0.05))',
                        border: '2px solid rgba(123, 160, 91, 0.2)'
                    }}
                >
                    {/* Donation Input */}
                    <div className="mb-8">
                        <label className="block text-lg font-semibold mb-4" style={{ color: '#2D3E35' }}>
                            Your Donation Amount
                        </label>

                        {/* Preset Buttons */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                            {presetAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => handlePresetClick(amount)}
                                    className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${donationAmount === amount
                                            ? 'text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                                        }`}
                                    style={donationAmount === amount ? {
                                        background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
                                    } : {}}
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>

                        {/* Slider */}
                        <div className="relative">
                            <input
                                type="range"
                                min="10"
                                max="2000"
                                step="5"
                                value={donationAmount}
                                onChange={handleSliderChange}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #7BA05B 0%, #7BA05B ${(donationAmount / 2000) * 100}%, #e5e7eb ${(donationAmount / 2000) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>$10</span>
                                <span>$2,000</span>
                            </div>
                        </div>

                        {/* Custom Amount Input */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold" style={{ color: '#7BA05B' }}>$</span>
                                <input
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(Math.max(10, parseInt(e.target.value) || 10))}
                                    className="text-4xl font-bold border-b-4 outline-none w-32 text-center"
                                    style={{ borderColor: '#7BA05B', color: '#2D3E35' }}
                                    min="10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Impact Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Backpacks */}
                        <div className="text-center p-6 rounded-xl bg-white shadow-md">
                            <div className="text-5xl mb-3">🎒</div>
                            <div className="text-4xl font-bold mb-2" style={{ color: '#7BA05B' }}>
                                {backpacks}
                            </div>
                            <div className="text-sm text-gray-600">
                                {backpacks === 1 ? 'Backpack' : 'Backpacks'}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="text-center p-6 rounded-xl bg-white shadow-md">
                            <div className="text-5xl mb-3">📦</div>
                            <div className="text-4xl font-bold mb-2" style={{ color: '#5D8A7A' }}>
                                {totalItems}
                            </div>
                            <div className="text-sm text-gray-600">
                                Essential Items
                            </div>
                        </div>

                        {/* People */}
                        <div className="text-center p-6 rounded-xl bg-white shadow-md">
                            <div className="text-5xl mb-3">❤️</div>
                            <div className="text-4xl font-bold mb-2" style={{ color: '#A8B89C' }}>
                                {peopleHelped}
                            </div>
                            <div className="text-sm text-gray-600">
                                {peopleHelped === 1 ? 'Person Helped' : 'People Helped'}
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Details */}
                    <div className="mt-8 p-6 rounded-xl" style={{
                        background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.1), rgba(93, 138, 122, 0.1))'
                    }}>
                        <h3 className="font-semibold mb-4" style={{ color: '#2D3E35' }}>
                            Your ${donationAmount} provides:
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <span className="mr-2" style={{ color: '#7BA05B' }}>✓</span>
                                <span className="text-gray-700">
                                    {backpacks} {backpacks === 1 ? 'backpack' : 'backpacks'} at $35 each
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2" style={{ color: '#7BA05B' }}>✓</span>
                                <span className="text-gray-700">
                                    {totalItems} essential items (hygiene, warmth, nutrition)
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2" style={{ color: '#7BA05B' }}>✓</span>
                                <span className="text-gray-700">
                                    Dignity and hope for {peopleHelped} {peopleHelped === 1 ? 'person' : 'people'} in need
                                </span>
                            </li>
                            {donationAmount > BACKPACK_COST && (
                                <li className="flex items-center">
                                    <span className="mr-2" style={{ color: '#7BA05B' }}>✓</span>
                                    <span className="text-gray-700">
                                        ${donationAmount - (backpacks * BACKPACK_COST)} towards future backpacks
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 text-center">
                        <button
                            className="px-10 py-4 rounded-full text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                            onClick={() => window.location.href = `/donate.html?amount=${donationAmount}`}
                        >
                            Donate ${donationAmount} Now
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            100% of your donation goes directly to purchasing backpack supplies
                        </p>
                    </div>
                </div>

                {/* Impact Statement */}
                <div className="mt-8 text-center p-6 rounded-xl" style={{
                    background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
                }}>
                    <p className="text-white text-lg">
                        <span className="font-bold">Every dollar counts.</span> Your generosity provides immediate relief and lasting dignity to those experiencing homelessness in Louisville.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ImpactCalculator;
