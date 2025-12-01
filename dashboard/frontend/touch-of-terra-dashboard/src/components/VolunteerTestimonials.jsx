import React, { useState, useEffect } from 'react';

const testimonials = [
    {
        name: 'Sarah Mitchell',
        role: 'Volunteer since 2024',
        photo: '👩', // Emoji placeholder
        quote: 'Volunteering with Touch of Terra has been one of the most rewarding experiences of my life. Seeing the direct impact of each backpack on someone\'s day makes every hour spent worth it.',
        rating: 5
    },
    {
        name: 'Michael Chen',
        role: 'St. Xavier Student Volunteer',
        photo: '👨',
        quote: 'As a student at St. X, being part of Touch of Terra taught me the true meaning of service. It\'s not just about giving items—it\'s about giving dignity and hope.',
        rating: 5
    },
    {
        name: 'Jennifer Rodriguez',
        role: 'Monthly Volunteer',
        photo: '👩',
        quote: 'The organization is incredible. Every distribution event is well-organized, and you can see the genuine appreciation from those we help. I\'ve brought my whole family to volunteer!',
        rating: 5
    },
    {
        name: 'David Thompson',
        role: 'Volunteer Coordinator',
        photo: '👨',
        quote: 'Touch of Terra does an amazing job connecting volunteers with meaningful work. The backpack assembly events are fun, social, and impactful. You leave feeling like you made a real difference.',
        rating: 5
    },
    {
        name: 'Emily Johnson',
        role: 'First-time Volunteer',
        photo: '👩',
        quote: 'I came to my first event not knowing what to expect, but the team was so welcoming. Now I volunteer every month! It\'s become something I look forward to.',
        rating: 5
    },
    {
        name: 'Robert Williams',
        role: 'Corporate Volunteer',
        photo: '👨',
        quote: 'Our company partners with Touch of Terra for team building. It\'s the perfect blend of community service and team bonding. Highly recommend for any organization!',
        rating: 5
    }
];

const VolunteerTestimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance testimonials every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextTestimonial = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToTestimonial = (index) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-12" aria-labelledby="testimonials-heading">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D3E35' }}>
                    Volunteer Stories
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Hear from our amazing volunteers about their experiences serving with Touch of Terra
                </p>
            </div>

            {/* Main Testimonial Card */}
            <div className="max-w-4xl mx-auto">
                <div
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative"
                    style={{
                        background: 'linear-gradient(135deg, rgba(123, 160, 91, 0.05), rgba(93, 138, 122, 0.05))',
                        border: '2px solid rgba(123, 160, 91, 0.2)'
                    }}
                >
                    {/* Quote Icon */}
                    <div className="absolute top-4 left-4 text-6xl opacity-10" style={{ color: '#7BA05B' }}>
                        "
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Photo and Name */}
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4" style={{
                                background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)'
                            }}>
                                {currentTestimonial.photo}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold" style={{ color: '#2D3E35' }}>
                                    {currentTestimonial.name}
                                </h3>
                                <p className="text-sm" style={{ color: '#7BA05B' }}>
                                    {currentTestimonial.role}
                                </p>
                            </div>
                        </div>

                        {/* Quote */}
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 italic">
                            "{currentTestimonial.quote}"
                        </p>

                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                                <span key={i} className="text-2xl" style={{ color: '#7BA05B' }}>
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                            aria-label="Previous testimonial"
                        >
                            ←
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? 'w-8' : 'opacity-50'
                                        }`}
                                    style={{ backgroundColor: '#7BA05B' }}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                            aria-label="Next testimonial"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-8">
                    <p className="text-lg text-gray-700 mb-4">
                        Want to join our team of <span className="font-bold" style={{ color: '#7BA05B' }}>45 amazing volunteers</span>?
                    </p>
                    <button
                        className="px-8 py-3 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #7BA05B, #5D8A7A)' }}
                        onClick={() => window.location.href = '/volunteer.html'}
                    >
                        Sign Up to Volunteer
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VolunteerTestimonials;
