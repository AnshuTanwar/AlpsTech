import { callAPI } from '@/api/mongo-api';

export interface Result {
  _id: string;
  studentEmail: string;
  studentName: string;
  courseId: string;
  courseName: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
  feedback?: string;
}

export const getAllResults = async (): Promise<Result[]> => {
  const response = await callAPI<Result[]>('GET', 'admin/results');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load results. Please try again later.');
  }
  return response.data;
};

export const getStudentResults = async (): Promise<Result[]> => {
  const response = await callAPI<Result[]>('GET', 'student/results');
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load your results. Please try again later.');
  }
  return response.data;
};

export const getResultById = async (id: string): Promise<Result> => {
  const response = await callAPI<Result>('GET', `admin/results/${id}`);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to load result details. Please try again later.');
  }
  return response.data;
};

export const createResult = async (resultData: Omit<Result, '_id'>): Promise<Result> => {
  const response = await callAPI<Result>('POST', 'admin/results', resultData);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to create result. Please try again.');
  }
  return response.data;
};

export const updateResult = async (id: string, resultData: Partial<Result>): Promise<Result> => {
  const response = await callAPI<Result>('PATCH', `admin/results/${id}`, resultData);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unable to update result. Please try again.');
  }
  return response.data;
};

export const deleteResult = async (id: string): Promise<void> => {
  const response = await callAPI<void>('DELETE', `admin/results/${id}`);
  if (!response.success) {
    throw new Error(response.error || 'Unable to delete result. Please try again.');
  }
}; 