import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { coursesData } from '@/lib/data';
import { fetchCoursesFromMongoDB, saveCoursesToMongoDB } from '@/services/courseService';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { MONGODB_URI } from '@/lib/env';
import MongoDBTest from './MongoDBTest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MongoDBSetup: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [courseCount, setCourseCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Test the MongoDB connection and get course count
  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    setErrorMessage(null);
    
    try {
      const courses = await fetchCoursesFromMongoDB();
      setCourseCount(courses.length);
      setConnectionStatus('connected');
      toast.success("Successfully connected to MongoDB!");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      setConnectionStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Failed to connect to MongoDB. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Import sample data to MongoDB
  const importSampleData = async () => {
    setIsLoading(true);
    
    try {
      const result = await saveCoursesToMongoDB(coursesData);
      if (result) {
        toast.success("Sample data imported to MongoDB successfully!");
        // Refresh course count
        testConnection();
      } else {
        toast.error("Failed to import sample data.");
      }
    } catch (error) {
      console.error("Error importing sample data:", error);
      toast.error("Error importing sample data. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically test connection when component mounts
    testConnection();
  }, []);

  // Check if we're using Atlas or local
  const isUsingAtlas = !MONGODB_URI.includes('localhost');
  const hasMissingCredentials = MONGODB_URI.includes('<db_password>');

  return (
    <div className="space-y-6">
      <MongoDBTest />
      
      <Card>
        <CardHeader>
          <CardTitle>MongoDB Connection Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2">Current MongoDB Connection:</h3>
              <p className="mb-1">Using: <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">{MONGODB_URI.replace(/(?<=:\/\/[^:]+:)[^@]+(?=@)/, '******')}</code></p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {!isUsingAtlas ? 
                  'Running with local database. Set up .env.local to use MongoDB Atlas.' : 
                  hasMissingCredentials ?
                  'Connected to Atlas but missing password. Set VITE_MONGODB_PASSWORD in .env.local.' :
                  'Connected to MongoDB Atlas database.'
                }
              </p>
            </div>

            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2">MongoDB Atlas Connection:</h3>
              <p className="mb-1">To connect to MongoDB Atlas:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Create a <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">.env.local</code> file in the project root</li>
                <li>Add the following environment variables:</li>
              </ol>
              <div className="mt-3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-200 dark:bg-gray-700">
                <pre className="text-xs overflow-auto">
# .env.local example
VITE_MONGODB_URI=mongodb+srv://aanshutanwar07:&lt;db_password&gt;@cluster0.8z4edvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
VITE_MONGODB_PASSWORD=your_actual_password_here
                </pre>
              </div>
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Remember to restart your development server after creating or modifying .env.local
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">How do I get started?</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Setting up MongoDB Atlas</DialogTitle>
                    <DialogDescription>
                      Follow these steps to connect your application to MongoDB Atlas
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4 text-sm">
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>Create a <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">.env.local</code> file in the root of your project</li>
                      <li>Copy the environment variables shown above into your .env.local file</li>
                      <li>Replace <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">your_actual_password_here</code> with your MongoDB Atlas password</li>
                      <li>Save the file and restart your development server</li>
                      <li>Click the "Test Connection" button to verify the connection</li>
                    </ol>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className={`p-3 rounded ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
              connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {connectionStatus === 'connected' && (
                <>
                  Connected to MongoDB successfully!
                  {courseCount > 0 ? 
                    <div className="mt-1">Found {courseCount} courses in the database.</div> :
                    <div className="mt-1">No courses found. You can import sample data.</div>
                  }
                </>
              )}
              {connectionStatus === 'connecting' && 'Connecting to MongoDB...'}
              {connectionStatus === 'failed' && (
                <>
                  Failed to connect to MongoDB. Check your connection string and make sure MongoDB is running.
                  {errorMessage && <div className="mt-1 text-sm overflow-x-auto">{errorMessage}</div>}
                </>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button onClick={testConnection} disabled={isLoading}>
              {isLoading && connectionStatus === 'connecting' ? 'Connecting...' : 'Test Connection'}
            </Button>
            <Button onClick={importSampleData} disabled={isLoading || connectionStatus !== 'connected'} variant="outline">
              {isLoading && connectionStatus === 'connected' ? 'Importing...' : 'Import Sample Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MongoDBSetup;
