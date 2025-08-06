import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { Heart, Users, Lightbulb } from 'lucide-react';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Hero />

      {/* About Touch of Terra Section */}
      <section id="about-section" className="section-padding bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
              About <span className="text-gradient">Touch of Terra</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Touch of Terra is more than just providing backpacks – we're building bridges of compassion 
              in our community. Each backpack contains carefully selected food, toiletries, and necessities 
              that offer immediate relief while we work toward long-term solutions to homelessness.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="card text-center">
              <div className="bg-teal-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Immediate Relief</h3>
              <p className="text-gray-600">
                Each backpack provides essential items for immediate needs, offering dignity and care to those experiencing homelessness.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="card text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Community Education</h3>
              <p className="text-gray-600">
                We educate the public about homelessness, breaking down stigma and building understanding in our community.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="card text-center">
              <div className="bg-terra-brown-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-terra-brown-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Advocacy</h3>
              <p className="text-gray-600">
                We advocate for systemic changes and long-term solutions to address the root causes of homelessness.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="section-padding bg-gradient-to-r from-teal-500 to-green-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-6">
              Help Us Carry Compassion Forward
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
              Your donation directly funds backpacks filled with essentials for those in need. 
              Every contribution makes an immediate impact in someone's life.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/donate" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;