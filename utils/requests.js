import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const BASE_URL = 'https://gazansolution-production.up.railway.app'; // Define BASE_URL without exporting here

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Log the request details first
    console.log('--- Request Interceptor ---');
    console.log('Method:', config.method.toUpperCase());
    console.log('URL:', config.baseURL + config.url);
    console.log('Initial Headers:', JSON.stringify(config.headers, null, 2)); // Log initial headers

    try {
      // Retrieve token from AsyncStorage using 'userToken' key
      const token = await AsyncStorage.getItem('userToken');
      console.log('[Interceptor] Token retrieved from AsyncStorage:', token ? `"${token.substring(0, 10)}..."` : null); // Log retrieved token (truncated)

      if (token) {
        console.log('[Interceptor] Token found, adding custom "tokenstring" header.');
        // Add the custom header expected by the API
        config.headers.tokenstring = token;
        // Ensure standard Authorization header is removed
        delete config.headers.Authorization;
        // Also remove the other variation if present
        delete config.headers.TokenString;
      } else {
        console.log('[Interceptor] No token found in AsyncStorage.');
      }
    } catch (error) {
        console.error('[Interceptor] Error retrieving token from AsyncStorage:', error);
    }

    // Log final headers before sending
    console.log('Final Headers:', JSON.stringify(config.headers, null, 2));

    if (config.params) {
      console.log('Params:', JSON.stringify(config.params, null, 2));
    }
    if (config.data) {
      console.log('Data:', JSON.stringify(config.data, null, 2));
    }
    console.log('---------------------------');

    return config;
  },
  (error) => {
    // Log request error
    console.error('--- Request Interceptor Error ---');
    console.error(error);
    console.error('-------------------------------');
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log the response
    console.log('--- Response ---');
    console.log('Status:', response.status);
    console.log('URL:', response.config.baseURL + response.config.url);
    if (response.data) {
      // Limit logged data size for large responses if necessary
      const responseDataString = JSON.stringify(response.data, null, 2);
      console.log('Data:', responseDataString.length > 1000 ? responseDataString.substring(0, 1000) + '... (truncated)' : responseDataString);
    }
    console.log('----------------');
    return response;
  },
  (error) => {
    // Log response error
    console.error('--- Response Error ---');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config.baseURL + error.config.url);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('Request Error: No response received', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    console.error('----------------------');
    return Promise.reject(error);
  }
);

// Export the configured instance and BASE_URL correctly
export { api, BASE_URL };