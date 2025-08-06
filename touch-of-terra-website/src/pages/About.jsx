import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-teal-600 mb-4">About Touch of Terra</h1>
            
            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-green-600">Mission Statement</h2>
                <p className="mt-2 text-gray-700">
                    Touch of Terra provides ready-to-go backpacks filled with food, toiletries, and other necessities for those in need, while also educating the public and advocating for solutions to homelessness.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-green-600">Backpack Initiative</h2>
                <p className="mt-2 text-gray-700">
                    Each backpack contains essential items such as non-perishable food, hygiene products, and other necessities to support individuals and families in need.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-green-600">Advocacy & Education</h2>
                <p className="mt-2 text-gray-700">
                    We believe in the power of education to create change. Our advocacy efforts focus on raising awareness about homelessness and providing resources to help those affected.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-green-600">Legacy of Terra</h2>
                <p className="mt-2 text-gray-700">
                    Terra was a compassionate individual whose spirit inspires our mission. We honor her legacy by continuing her work and spreading kindness in our community.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-green-600">Our Vision for the Future</h2>
                <p className="mt-2 text-gray-700">
                    We envision a world where everyone has access to basic necessities and support. Together, we can make a difference and create lasting change.
                </p>
            </section>
        </div>
    );
};

export default About;