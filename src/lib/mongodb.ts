
import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGODB_URI } from './env';

const uri = MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        throw err;
      });
  }
  
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  
  clientPromise = client.connect()
    .catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    });
}

export default clientPromise;


export async function getDb(dbName?: string) {
  const client = await clientPromise;
  if (!dbName) {
    const uriParts = uri.split('/');
    dbName = uriParts[uriParts.length - 1].split('?')[0] || 'alpstech';
  }
  return client.db(dbName);
}

export async function getCollection(collectionName: string, dbName?: string) {
  const db = await getDb(dbName);
  return db.collection(collectionName);
}


export async function initializeDb(data: { [collection: string]: any[] }) {
  try {
    const db = await getDb();
    
    for (const [collectionName, documents] of Object.entries(data)) {
      if (documents.length > 0) {
        const collection = db.collection(collectionName);
        await collection.deleteMany({});
        await collection.insertMany(documents);
        console.log(`Initialized collection: ${collectionName} with ${documents.length} documents`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}


