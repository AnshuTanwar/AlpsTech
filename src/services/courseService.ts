import { callAPI } from '@/api/mongo-api';

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  price: number;
  image: string;
  enrollmentStatus: 'open' | 'closed' | 'in progress';
  createdAt: string;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await callAPI<Course[]>('GET', 'courses');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load courses. Please try again later.');
  }
  return response.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await callAPI<Course>('GET', `courses/${id}`);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load course details. Please try again later.');
  }
  return response.data;
};

export const createCourse = async (courseData: Omit<Course, '_id' | 'createdAt'>): Promise<Course> => {
  const response = await callAPI<Course>('POST', 'admin/courses', courseData);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to create course. Please try again.');
  }
  return response.data;
};

export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
  const response = await callAPI<Course>('PATCH', `admin/courses/${id}`, courseData);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to update course. Please try again.');
  }
  return response.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  const response = await callAPI<void>('DELETE', `admin/courses/${id}`);
  if (!response.success) {
    throw new Error(response.error || 'Unable to delete course. Please try again.');
  }
};
