import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import TributeSection from '../components/TributeSection';
import FounderStory from '../components/FounderStory';
import GetInvolved from '../components/GetInvolved';
import DonationPreview from '../components/DonationPreview';

const Home = () => {
    return (
        <div className="flex flex-col items-center">
            <Hero />
            <AboutSection />
            <TributeSection />
            <FounderStory />
            <GetInvolved />
            <DonationPreview />
        </div>
    );
};

export default Home;