import axios from 'axios';

const API_BASE_URL = 'https://api.touchofterra.org'; // Replace with your actual API base URL

export const donate = async (donationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/donate`, donationData);
        return response.data;
    } catch (error) {
        console.error('Error processing donation:', error);
        throw error;
    }
};

export const contactUs = async (contactData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact`, contactData);
        return response.data;
    } catch (error) {
        console.error('Error sending contact message:', error);
        throw error;
    }
};

export const volunteer = async (volunteerData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/volunteer`, volunteerData);
        return response.data;
    } catch (error) {
        console.error('Error submitting volunteer application:', error);
        throw error;
    }
};