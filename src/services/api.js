import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://0.0.0.0:8000/';
// const API_BASE_URL = 'http://10.73.62.114:8000/';
// const API_BASE_URL = 'http://10.73.62.177:8000/';
// const API_BASE_URL = 'http://server:8001/';



// Define all necessary endpoints
// Define all necessary endpoints
const endpoints = {
  // Users
  REGISTER: 'user/register/',
  LOGIN: 'user/login/',
  USER: 'user/user/',
  USERS: 'user/users/',
  CREATE_STAFF: 'user/admin/create-staff/',

  // Centers
  CENTERS: 'api/centers/',

  // Sections
  SECTIONS: 'api/sections/',

  // Categories
  CATEGORIES: 'api/categories/',

  // Subscriptions
  SUBSCRIPTIONS: 'api/subscriptions/',

  // Schedules
  SCHEDULES: 'api/schedules/',
  
  // Records
  RECORDS: 'api/records/', 
  
  // Dashboard Endpoints
  DASHBOARD_METRICS: 'api/dashboard/metrics/',
  DASHBOARD_RECENT_ACTIVITIES: 'api/dashboard/recent-activities/',
  DASHBOARD_NOTIFICATIONS: 'api/dashboard/notifications/',

  //Syllabus
  GET_SYLLABUSES: 'api/get_tests/',
  GENERATE_SYLLABUS: 'api/generate/'
};


// Create an axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Automatically prefixes all requests with the base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Assuming you're storing the JWT token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle errors in request interception
  }
);

// Export the axiosInstance and endpoints for use in the rest of the app
export { axiosInstance, endpoints };
