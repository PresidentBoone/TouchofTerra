import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="flex flex-col items-center justify-center h-screen bg-teal-500 text-white text-center p-4">
            <motion.img 
                src="/images/logo.png" 
                alt="Touch of Terra Logo" 
                className="mb-4 w-1/3 md:w-1/4"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }}
            />
            <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-2"
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.5 }}
            >
                Carrying Compassion, One Backpack at a Time
            </motion.h1>
            <motion.a 
                href="#donate" 
                className="mt-4 bg-brown-600 text-white py-2 px-4 rounded shadow hover:bg-brown-700 transition"
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5 }}
            >
                Donate Now
            </motion.a>
        </section>
    );
};

export default Hero;