import { callAPI } from '@/api/mongo-api';

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalResults: number;
  openEnrollments: number;
}

export interface Enrollment {
  _id: string;
  enrollmentDate: string;
  user: { name: string }[];
  course: { title: string }[];
}

export interface Result {
  _id: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
  user: { name: string }[];
  course: { title: string }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await callAPI<DashboardStats>('GET', 'admin/dashboard/stats');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load dashboard stats. Please try again later.');
  }
  return response.data;
};

export const getRecentEnrollments = async (): Promise<Enrollment[]> => {
  const response = await callAPI<Enrollment[]>('GET', 'admin/dashboard/recent-enrollments');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load recent enrollments. Please try again later.');
  }
  return response.data;
};

export const getLatestResults = async (): Promise<Result[]> => {
  const response = await callAPI<Result[]>('GET', 'admin/dashboard/latest-results');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load latest results. Please try again later.');
  }
  return response.data;
}; 