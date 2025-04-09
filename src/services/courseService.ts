
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { Course } from '@/components/CourseCard';

// Example service for courses
export async function fetchCoursesFromMongoDB(): Promise<Course[]> {
  try {
    const collection = await getCollection('courses');
    const documents = await collection.find({}).toArray();
    
    // Map MongoDB documents to Course objects
    const courses: Course[] = documents.map(doc => ({
      id: doc._id.toString(), 
      title: doc.title as string,
      description: doc.description as string,
      instructor: doc.instructor as string,
      duration: doc.duration as string,
      level: doc.level as "beginner" | "intermediate" | "advanced",
      price: doc.price as number,
      image: doc.image as string,
      enrollmentStatus: doc.enrollmentStatus as "open" | "closed" | "in progress" | undefined,
    }));
    
    return courses;
  } catch (error) {
    console.error("Error fetching courses from MongoDB:", error);
    throw error; 
  }
}

export async function saveCoursesToMongoDB(courses: Course[]): Promise<boolean> {
  try {
    const collection = await getCollection('courses');
    
    await collection.deleteMany({});
    
    if (courses.length > 0) {
      const documents = courses.map(course => {
        const { id, ...courseData } = course;
        return {
          _id: id.match(/^[0-9a-fA-F]{24}$/) ? new ObjectId(id) : new ObjectId(),
          ...courseData
        };
      });
      
      await collection.insertMany(documents);
    }
    return true;
  } catch (error) {
    console.error("Error saving courses to MongoDB:", error);
    throw error; 
  }
}
