import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LoadingBar } from "@/components/ui/loading-bar";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getStudentResults } from "@/services/resultService";
import { getAllCourses } from "@/services/courseService";
import { getAssignments, getAssignmentPdfUrl, Assignment } from '@/services/assignmentService';
import { useQuery as useRQ } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { FileText } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  // Fetch all courses and student results
  const { data: allCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses
  });
  const { data: results = [], isLoading: isResultsLoading } = useQuery({
    queryKey: ['studentResults'],
    queryFn: getStudentResults,
    enabled: !!user
  });
  // Filter enrolled courses for the user
  const enrolledCourses = allCourses.filter((course: any) => user?.enrolledCourses?.includes(course._id));
  const isLoading = isResultsLoading;
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  // Array of video IDs for each module
  const moduleVideos = [
    "SzJ46YA_RaA",  // Module 1 video ID
    "-uleG_Vecis",  // Module 2 video ID
    "zOjov-2OZ0E",  // Module 3 video ID
    "OdziYWEkDIM"   // Module 4 video ID
  ];

  const handleViewLessons = (moduleIndex: number) => {
    setCurrentVideoId(moduleVideos[moduleIndex]);
    setIsVideoOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get the latest result
  const latestResult = results.length > 0 ? 
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : 
    null;

  // Assignment viewer for students
  function AssignmentViewer({ courseId }: { courseId: string }) {
    const { data: assignments = [], isLoading, error }: UseQueryResult<Assignment[]> = useRQ({
      queryKey: ['assignments', courseId],
      queryFn: () => getAssignments(courseId)
    });
    if (isLoading) return <div className="text-xs text-gray-500">Loading assignments...</div>;
    if (error) return <div className="text-xs text-red-500">Failed to load assignments.</div>;
    return (
      <div className="mt-2">
        <div className="font-semibold text-sm mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Assignments
        </div>
        {assignments.length === 0 ? (
          <div className="text-xs text-gray-500">No assignments yet.</div>
        ) : (
          <ul className="space-y-2 mt-1">
            {assignments.map((a: Assignment) => (
              <li key={a._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded shadow-sm">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-sm">{a.title}</span>
                <a href={getAssignmentPdfUrl(a._id)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">View PDF</a>
                <span className="text-xs text-gray-500">{a.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Courses</CardTitle>
            <CardDescription>
              You're enrolled in {enrolledCourses.length} courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {enrolledCourses.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Result</CardTitle>
            <CardDescription>
              Your most recent test score
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestResult ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm truncate" title={latestResult.courseName}>
                    {latestResult.courseName}
                  </span>
                  <Badge>{latestResult.grade}</Badge>
                </div>
                <Progress value={(latestResult.score / latestResult.maxScore) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Score: {latestResult.score}/{latestResult.maxScore}</span>
                  <span>{latestResult.date}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <span className="text-gray-500">No results yet</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Manage your student account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/courses">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Browse Courses
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/results">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                  View Results
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled courses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <Button asChild variant="outline">
            <Link to="/courses">Browse More Courses</Link>
          </Button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: any) => (
              <Card key={course._id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="truncate" title={course.title}>
                    {course.title}
                  </CardTitle>
                  <CardDescription>
                    Enrolled on: {new Date(course.enrollmentDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AssignmentViewer courseId={course._id} />
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link to={`/courses/${course._id}`}>Continue Learning</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewLessons(0)}
                      >
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-4">
                Explore our course catalog and start your learning journey today.
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Course Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
              title="Course Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Results</h2>
          <Button asChild variant="outline">
            <Link to="/results">View All Results</Link>
          </Button>
        </div>

        {results.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {results.slice(0, 3).map((result) => (
                  <tr key={result._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.score}/{result.maxScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge>{result.grade}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No results available</h3>
              <p className="text-gray-600">
                Results will appear here after completing course assessments.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
