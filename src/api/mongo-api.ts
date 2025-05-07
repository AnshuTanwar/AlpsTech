// This file serves as a client-side API adapter
// It will make HTTP requests to our Express backend server

// Use environment variables for API endpoint with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Log the API URL being used
console.log('Using API URL:', API_BASE_URL);

interface MongoDBResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic function to make requests to our Express API
export async function callAPI<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<MongoDBResponse<T>> {
  try {
    console.log(`API Request: ${method} ${endpoint}`, body);
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      // Include credentials for cookies if needed
      credentials: 'include'
    };

    // Add authorization header if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${user.email}`
        };
      }
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    // For GET requests with query params
    let url = `${API_BASE_URL}/${endpoint}`;
    if (method === 'GET' && body) {
      const queryParams = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      url += `?${queryParams.toString()}`;
    }

    console.log(`Fetching from URL: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`API Response:`, data);

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// API Functions for user operations
export async function createUserAPI(userData: any): Promise<MongoDBResponse<any>> {
  console.log('Creating user:', userData);
  return callAPI('POST', 'users', userData);
}

export async function findUserByEmailAPI(email: string): Promise<MongoDBResponse<any>> {
  return callAPI('GET', 'users', { email });
}

export async function updateUserEnrollmentAPI(userId: string, courseId: string): Promise<MongoDBResponse<any>> {
  return callAPI('PATCH', `users/${userId}/enroll`, { courseId });
}

// Test connection to MongoDB through our Express server
export async function testConnectionAPI(): Promise<MongoDBResponse<any>> {
  try {
    const response = await callAPI('GET', 'test-connection');
    return response;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to MongoDB',
    };
  }
} 