import { callAPI } from '@/api/mongo-api';

export interface Student {
  _id: string;
  name: string;
  email: string;
  enrolledCourses: {
    _id: string;
    title: string;
  }[];
  results: {
    _id: string;
    score: number;
    grade: string;
    courseId: string;
  }[];
}

export interface StudentEnrollment {
  _id: string;
  enrollmentDate: string;
  student: {
    _id: string;
    name: string;
  };
  course: {
    _id: string;
    title: string;
  };
}

export const getAllStudents = async (): Promise<Student[]> => {
  const response = await callAPI<Student[]>('GET', 'admin/students');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load students. Please try again later.');
  }
  return response.data;
};

export const getStudentEnrollments = async (): Promise<StudentEnrollment[]> => {
  const response = await callAPI<StudentEnrollment[]>('GET', 'admin/students/enrollments');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load student enrollments. Please try again later.');
  }
  return response.data;
}; 