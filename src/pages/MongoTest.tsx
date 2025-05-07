import React, { useEffect, useState } from 'react';
import { testMongoConnection } from '@/services/testConnection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MongoTest = () => {
  const [status, setStatus] = useState<string>('idle');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Test connection on page load
    handleTestConnection();
  }, []);

  async function handleTestConnection() {
    setStatus('testing');
    try {
      // Log URI to console for debugging
      console.log('VITE_MONGO_URI defined:', !!import.meta.env.VITE_MONGO_URI);
      console.log('Environment variables:', Object.keys(import.meta.env));
      
      const connectionResult = await testMongoConnection();
      console.log('Connection test result:', connectionResult);
      setResult(connectionResult);
      setStatus(connectionResult.success ? 'success' : 'error');
    } catch (error) {
      console.error('Connection test error:', error);
      setResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
      setStatus('error');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MongoDB Connection Tester</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className={`p-3 rounded ${
              status === 'success' ? 'bg-green-100 text-green-800' : 
              status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {status === 'idle' && 'Ready to test connection...'}
              {status === 'testing' && 'Testing connection...'}
              {status === 'success' && 'Connection successful! ✅'}
              {status === 'error' && 'Connection failed! ❌'}
              
              {result && (
                <div className="mt-2 text-sm">
                  <p><strong>Message:</strong> {result.message}</p>
                </div>
              )}
            </div>
          </div>
          
          <Button onClick={handleTestConnection} disabled={status === 'testing'}>
            {status === 'testing' ? 'Testing...' : 'Test Connection Again'}
          </Button>
        </CardContent>
      </Card>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Debugging Information</h2>
        <p className="mb-2">If you're having issues, check the following:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Make sure your .env or .env.local file has the VITE_MONGO_URI variable set correctly</li>
          <li>Check that your MongoDB Atlas cluster is running and accessible</li>
          <li>Verify that your IP address is allowed in the MongoDB Atlas Network Access settings</li>
          <li>Open the browser console (F12) to see detailed error messages</li>
        </ol>
      </div>
    </div>
  );
};

export default MongoTest; 