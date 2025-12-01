import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const partners = [
    // ... (keep partners array as is)
];

const PartnerSpotlight = () => {
    const { t } = useLanguage();

    return (
        <section className="py-12" aria-labelledby="partners-heading">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 id="partners-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                    {t('partners.title')}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    {t('partners.subtitle')}
                </p>
            </div>

            {/* Partner Cards */}
            <div className="space-y-12">
                {partners.map((partner, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="md:flex">
                            {/* Logo Section */}
                            <div className="md:w-1/3 p-8 flex items-center justify-center" style={{
                                background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.1), rgba(93, 138, 122, 0.1))'
                            }}>
                                <div className="text-center">
                                    {/* Partner Logo */}
                                    <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center p-4">
                                        <img
                                            src={partner.logo}
                                            alt={`${partner.name} logo`}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                // Fallback to initials if image fails to load
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = `<div class="text-white text-4xl font-bold w-full h-full flex items-center justify-center rounded-lg border-4 border-white shadow-lg" style="background-color: #7BA05B;">${partner.name.split(' ').map(word => word[0]).join('')}</div>`;
                                            }}
                                        />
                                    </div>
                                    <a
                                        href={partner.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
                                        style={{
                                            background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)',
                                            color: 'white'
                                        }}
                                    >
                                        {t('partners.visit')}
                                    </a>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="md:w-2/3 p-8">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#2D3E35' }}>
                                        {partner.name}
                                    </h3>
                                    <p className="text-sm font-semibold" style={{ color: '#7BA05B' }}>
                                        {partner.partnership}
                                    </p>
                                </div>

                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {partner.description}
                                </p>

                                {/* Contributions */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3" style={{ color: '#2D3E35' }}>
                                        Partnership Contributions:
                                    </h4>
                                    <ul className="space-y-2">
                                        {partner.contributions.map((contribution, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="mr-2" style={{ color: '#7BA05B' }}>✓</span>
                                                <span className="text-gray-700">{contribution}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Impact Stats */}
                                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl" style={{
                                    background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.05), rgba(93, 138, 122, 0.05))'
                                }}>
                                    {Object.entries(partner.impact).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <div className="text-2xl font-bold" style={{ color: '#7BA05B' }}>
                                                {value}
                                            </div>
                                            <div className="text-xs text-gray-600 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Contact Info */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold mb-3 text-sm" style={{ color: '#2D3E35' }}>
                                        {t('partners.contact')}:
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div>
                                            <i className="fas fa-phone mr-2" style={{ color: '#7BA05B' }}></i>
                                            <a href={`tel:${partner.contact.phone} `} className="hover:underline">
                                                {partner.contact.phone}
                                            </a>
                                        </div>
                                        <div>
                                            <i className="fas fa-envelope mr-2" style={{ color: '#7BA05B' }}></i>
                                            <a href={`mailto:${partner.contact.email} `} className="hover:underline">
                                                {partner.contact.email}
                                            </a>
                                        </div>
                                        <div className="md:col-span-2">
                                            <i className="fas fa-map-marker-alt mr-2" style={{ color: '#7BA05B' }}></i>
                                            {partner.contact.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Become a Partner CTA */}
            <div className="mt-12 text-center p-8 rounded-2xl" style={{
                background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
            }}>
                <h3 className="text-2xl font-bold text-white mb-4">
                    Interested in Partnering with Touch of Terra?
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    We're always looking to collaborate with organizations that share our mission of serving those experiencing homelessness. Partner with us to make a bigger impact together.
                </p>
                <button
                    className="px-8 py-3 bg-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ color: '#7BA05B' }}
                    onClick={() => window.location.href = '/contact.html'}
                >
                    Contact Us About Partnerships
                </button>
            </div>
        </section>
    );
};

export default PartnerSpotlight;
