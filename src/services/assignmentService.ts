import { callAPI } from '@/api/mongo-api';

export interface Assignment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  pdfPath: string;
  createdAt: string;
}

// Admin: Upload assignment
export async function uploadAssignment(courseId: string, data: FormData) {
  const response = await fetch(`/api/admin/courses/${courseId}/assignments`, {
    method: 'POST',
    body: data,
    credentials: 'include'
  });
  return await response.json();
}

// Student: Get assignments for a course
export async function getAssignments(courseId: string): Promise<Assignment[]> {
  const response = await callAPI<Assignment[]>('GET', `courses/${courseId}/assignments`);
  if (!response.success || !response.data) throw new Error(response.error || 'Failed to fetch assignments');
  return response.data;
}

// Get PDF URL
export function getAssignmentPdfUrl(assignmentId: string) {
  return `/api/assignments/${assignmentId}/pdf`;
} 