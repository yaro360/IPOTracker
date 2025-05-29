import axios from 'axios';

// Base URL for API calls
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ipo-tracker.vercel.app' 
  : 'http://localhost:3000';

// Fetch upcoming IPOs
export const fetchUpcomingIPOs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/ipo-calendar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming IPOs:', error);
    throw error;
  }
};

// Fetch angel investments
export const fetchAngelInvestments = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/angel-investments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching angel investments:', error);
    throw error;
  }
};

// Refresh data (manual trigger)
export const refreshAllData = async () => {
  try {
    const [ipos, angels] = await Promise.all([
      fetchUpcomingIPOs(),
      fetchAngelInvestments()
    ]);
    return { ipos, angels };
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
};
