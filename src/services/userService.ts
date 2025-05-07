import { createUserAPI, findUserByEmailAPI, updateUserEnrollmentAPI } from '@/api/mongo-api';

export interface UserWithPassword {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  enrolledCourses: string[];
  results: string[];
}

export type User = Omit<UserWithPassword, 'password'>;

export async function createUser(userData: Omit<UserWithPassword, 'id'>): Promise<UserWithPassword> {
  try {
    // Call API instead of direct MongoDB access
    console.log('Creating user via API:', userData);
    const response = await createUserAPI(userData);
    
    if (!response.success) {
      console.error('API error when creating user:', response.error);
      throw new Error(response.error || 'Failed to create user');
    }
    
    console.log('User created successfully:', response.data);
    
    // MongoDB Data API returns the user data
    if (!response.data?.id) {
      console.error('No user ID returned:', response.data);
      throw new Error('User created but no ID returned');
    }
    
    // Return user with ID
    return response.data as UserWithPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message.includes('already exists')) {
      throw new Error('User with this email already exists');
    }
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    console.log('Finding user by email:', email);
    // Call API instead of direct MongoDB access
    const response = await findUserByEmailAPI(email);
    
    if (!response.success || !response.data) {
      console.log('User not found or API error:', response.error);
      return null;
    }
    
    const user = response.data;
    console.log('User found:', user.id);
    
    // Return user with consistent ID format
    return user as UserWithPassword;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function updateUserEnrollment(userId: string, courseId: string): Promise<boolean> {
  try {
    console.log(`Enrolling user ${userId} in course ${courseId}`);
    // Call API instead of direct MongoDB access
    const response = await updateUserEnrollmentAPI(userId, courseId);
    
    console.log('Enrollment response:', response);
    return response.success && response.data?.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating user enrollment:', error);
    return false;
  }
} 