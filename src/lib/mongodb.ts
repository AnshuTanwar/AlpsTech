import { MongoClient, Db, Collection } from 'mongodb';

// Get MongoDB connection string from environment variables
const uri = import.meta.env.VITE_MONGO_URI;

// Log environment variables for debugging (remove in production)
console.log('Environment variables available:', Object.keys(import.meta.env));
console.log('VITE_MONGO_URI defined:', !!uri);

if (!uri) {
  console.error('MongoDB URI is missing from environment variables');
  throw new Error('Please define the VITE_MONGO_URI environment variable in your .env or .env.local file');
}

console.log('Connecting to MongoDB with URI:', uri.replace(/(?<=:\/\/[^:]+:)[^@]+(?=@)/, '******'));

const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority',
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
});

let cachedDb: Db | null = null;
let isConnected = false;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb && isConnected) {
    return cachedDb;
  }

  try {
    if (!isConnected) {
      console.log('Connecting to MongoDB Atlas...');
      await client.connect();
      isConnected = true;
      console.log('Successfully connected to MongoDB Atlas');
    }

    const dbName = 'alpstech';
    cachedDb = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    return cachedDb;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    isConnected = false;
    throw new Error(error instanceof Error ? `MongoDB connection failed: ${error.message}` : 'Failed to connect to MongoDB');
  }
}

export async function getCollection(collectionName: string): Promise<Collection> {
  try {
    const db = await connectToDatabase();
    console.log(`Accessing collection: ${collectionName}`);
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error accessing collection ${collectionName}:`, error);
    throw error;
  }
}

// Handle cleanup on application shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});
