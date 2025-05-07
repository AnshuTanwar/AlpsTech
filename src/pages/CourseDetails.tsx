import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getCourseById } from "@/services/courseService";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isEnrolled, enrollInCourse } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  // Array of video IDs for each module
  const moduleVideos = [
    "SzJ46YA_RaA",  // Module 1 video ID
    "-uleG_Vecis",  // Module 2 video ID
    "zOjov-2OZ0E",  // Module 3 video ID
    "OdziYWEkDIM"   // Module 4 video ID
  ];

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id!),
    enabled: !!id
  });

  const handleEnroll = () => {
    if (!user) {
      toast.error("Please log in to enroll in this course");
      return;
    }
    
    if (course?.enrollmentStatus === "closed") {
      toast.error("This course is currently closed for enrollment");
      return;
    }
    
    if (course) {
      enrollInCourse(course._id);
    }
  };

  const handleViewLessons = (moduleIndex: number) => {
    setCurrentVideoId(moduleVideos[moduleIndex]);
    setIsVideoOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
            <p>Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : "The course you're looking for doesn't exist or has been removed."}
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isUserEnrolled = user && isEnrolled(course._id);
  const canEnroll = !isUserEnrolled && course.enrollmentStatus === "open";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Course Image and Enrollment */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img 
                src={course.image || 'https://via.placeholder.com/640x360?text=Course+Image'} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-6">
              <div className="space-y-2 mb-4">
                <Badge variant={course.enrollmentStatus === "open" ? "default" : "outline"}>
                  {course.enrollmentStatus === "open" ? "Open for Enrollment" : 
                   course.enrollmentStatus === "in progress" ? "In Progress" : "Closed"}
                </Badge>
                <p className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Duration: {course.duration}
                </p>
                <p className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v8.5l3.5 3.5"/><circle cx="12" cy="12" r="10"/></svg>
                  Level: {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </p>
                <p className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Instructor: {course.instructor}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">₹{course.price}</span>
                  {isUserEnrolled ? (
                    <Badge variant="outline">Enrolled</Badge>
                  ) : (
                    <Button 
                      onClick={handleEnroll}
                      disabled={!canEnroll}
                    >
                      {canEnroll ? "Enroll Now" : "Enrollment Closed"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link to="/courses" className="text-brand-blue hover:underline inline-flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
              Back to Courses
            </Link>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>

          <Tabs defaultValue="content" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>Understand core concepts and principles</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>Build practical projects</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>Apply knowledge in practical scenarios</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Course Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((module, index) => (
                        <div key={module} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Module {module}: Key Concepts</h3>
                            <Badge variant="outline">4 Lessons</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Learn the fundamental building blocks and essential theory.</p>
                          {isUserEnrolled ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewLessons(index)}
                            >
                              View Lessons
                            </Button>
                          ) : (
                            <p className="text-sm text-gray-500">Enroll to access lessons</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`}
                        alt={course.instructor}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{course.instructor}</h3>
                      <p className="text-gray-600">
                        Expert instructor with extensive experience in teaching and practical application.
                        Committed to helping students master the subject matter through hands-on learning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews yet.</p>
                    {isUserEnrolled && (
                      <Button className="mt-4" variant="outline">Write a Review</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
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
    </div>
  );
};

export default CourseDetails;
