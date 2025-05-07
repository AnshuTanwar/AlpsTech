import { testConnectionAPI } from '@/api/mongo-api';

export async function testMongoConnection() {
  try {
    console.log('Testing MongoDB connection via backend API...');
    
    const result = await testConnectionAPI();
    
    if (result.success) {
      console.log('Successfully connected to MongoDB via backend');
      return {
        success: true,
        message: 'Successfully connected to MongoDB through backend server'
      };
    } else {
      console.error('Connection test failed:', result.error);
      return {
        success: false,
        message: result.error || 'Connection failed - see console for details'
      };
    }
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : 'Failed to connect to backend API - make sure the server is running'
    };
  }
} 