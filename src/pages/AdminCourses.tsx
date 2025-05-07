import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingBar } from "@/components/ui/loading-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAllCourses, createCourse, updateCourse, deleteCourse, type Course } from "@/services/courseService";
import { uploadAssignment, getAssignments, getAssignmentPdfUrl, Assignment } from '@/services/assignmentService';
import type { UseQueryResult } from '@tanstack/react-query';
import { Dialog as AssignmentDialog, DialogContent as AssignmentDialogContent, DialogHeader as AssignmentDialogHeader, DialogTitle as AssignmentDialogTitle, DialogTrigger as AssignmentDialogTrigger } from '@/components/ui/dialog';

const AdminCourses = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, '_id'>>({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    level: "beginner",
    price: 0,
    image: "",
    enrollmentStatus: "open",
    createdAt: new Date().toISOString()
  });

  const { 
    data: courses = [], 
    isLoading 
  } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses
  });

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsAddDialogOpen(false);
      toast.success("Course added successfully!");
      setNewCourse({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        level: "beginner",
        price: 0,
        image: "",
        enrollmentStatus: "open",
        createdAt: new Date().toISOString()
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add course");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsEditDialogOpen(false);
      setEditingCourse(null);
      toast.success("Course updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update course");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete course");
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEditing: boolean = false
  ) => {
    const { name, value } = e.target;
    const updatedValue = name === "price" ? (parseInt(value) || 0) : value;

    if (isEditing && editingCourse) {
      setEditingCourse(prev => ({
        ...prev,
        [name]: updatedValue,
      }));
    } else {
      setNewCourse(prev => ({
        ...prev,
        [name]: updatedValue,
      }));
    }
  };

  const handleSelectChange = (value: string, field: string, isEditing: boolean = false) => {
    if (isEditing && editingCourse) {
      setEditingCourse(prev => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setNewCourse(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddCourse = () => {
    createMutation.mutate(newCourse);
  };

  const handleEditCourse = () => {
    if (editingCourse) {
      updateMutation.mutate({
        id: editingCourse._id,
        data: editingCourse
      });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(courseId);
    }
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <LoadingBar 
          className="w-64"
          progress={100}
          variant="primary"
        />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  const CourseForm = ({ isEditing = false }) => {
    const data = isEditing ? editingCourse : newCourse;
    if (!data) return null;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.select();
    };

    return (
      <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto">
        <div className="grid gap-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            name="title"
            value={data.title}
            onChange={(e) => handleInputChange(e, isEditing)}
            onFocus={handleFocus}
            placeholder="Enter course title"
            autoComplete="off"
            className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={data.description}
            onChange={(e) => handleInputChange(e, isEditing)}
            onFocus={handleFocus}
            placeholder="Enter course description"
            className="h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              name="instructor"
              value={data.instructor}
              onChange={(e) => handleInputChange(e, isEditing)}
              onFocus={handleFocus}
              placeholder="Enter instructor name"
              autoComplete="off"
              className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={data.duration}
              onChange={(e) => handleInputChange(e, isEditing)}
              onFocus={handleFocus}
              placeholder="e.g., 8 weeks"
              autoComplete="off"
              className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={data.level}
              onValueChange={(value) => handleSelectChange(value, "level", isEditing)}
            >
              <SelectTrigger id="level" className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={data.price}
              onChange={(e) => handleInputChange(e, isEditing)}
              onFocus={handleFocus}
              min={0}
              autoComplete="off"
              className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            value={data.image}
            onChange={(e) => handleInputChange(e, isEditing)}
            onFocus={handleFocus}
            placeholder="Enter image URL"
            autoComplete="off"
            className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
          <Select
            value={data.enrollmentStatus}
            onValueChange={(value) => handleSelectChange(value, "enrollmentStatus", isEditing)}
          >
            <SelectTrigger id="enrollmentStatus" className="focus:outline-none focus:ring-1 focus:ring-blue-500 bg-background focus:bg-background">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  function AssignmentModal({ courseId, courseTitle }: { courseId: string, courseTitle: string }) {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pdf, setPdf] = useState<File | null>(null);
    const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
      queryKey: ['assignments', courseId],
      queryFn: () => getAssignments(courseId)
    });
    const mutation = useMutation({
      mutationFn: (formData: FormData) => uploadAssignment(courseId, formData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['assignments', courseId] });
        setTitle('');
        setDescription('');
        setPdf(null);
        toast.success('Assignment uploaded!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to upload assignment');
      }
    });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!pdf) return;
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('pdf', pdf);
      mutation.mutate(formData);
    };
    return (
      <div>
        <h3 className="font-bold text-lg mb-2">Assignments for {courseTitle}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4 p-4 bg-gray-50 rounded">
          <Input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <Input type="file" accept="application/pdf" onChange={e => setPdf(e.target.files?.[0] || null)} required />
          <Button type="submit" disabled={mutation.isPending} className="w-fit self-end">Upload Assignment</Button>
        </form>
        <div className="mb-2 font-semibold">Uploaded Assignments</div>
        {isLoading ? (
          <div className="text-xs text-gray-500">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-xs text-gray-500">No assignments yet.</div>
        ) : (
          <ul className="space-y-2">
            {assignments.map((a: Assignment) => (
              <li key={a._id} className="flex items-center gap-2 p-2 bg-white rounded shadow-sm">
                <span className="font-medium">{a.title}</span>
                <a href={getAssignmentPdfUrl(a._id)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
                <span className="text-xs text-gray-500">{a.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-gray-600 dark:text-gray-300">View and manage available courses</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add New Course
              </Button>
            </DialogTrigger>

            <DialogContent 
              className="sm:max-w-[600px] max-h-[90vh] overflow-hidden"
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Enter the details for the new course
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={(e) => e.preventDefault()}>
                <CourseForm isEditing={false} />
              </form>

              <DialogFooter className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCourse} 
                    className="sm:ml-2"
                  >
                    Add Course
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses ({courses?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Instructor</th>
                  <th scope="col" className="px-6 py-3">Level</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((course) => (
                  <tr key={course._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium">{course.title}</td>
                    <td className="px-6 py-4">{course.instructor}</td>
                    <td className="px-6 py-4 capitalize">{course.level}</td>
                    <td className="px-6 py-4">{course.duration}</td>
                    <td className="px-6 py-4">₹{course.price}</td>
                    <td className="px-6 py-4 capitalize">{course.enrollmentStatus}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => openEditDialog(course)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </Button>
                        <AssignmentDialog>
                          <AssignmentDialogTrigger asChild>
                            <Button variant="outline" size="sm">Assignments</Button>
                          </AssignmentDialogTrigger>
                          <AssignmentDialogContent className="max-w-lg">
                            <AssignmentDialogHeader>
                              <AssignmentDialogTitle>Manage Assignments</AssignmentDialogTitle>
                            </AssignmentDialogHeader>
                            <AssignmentModal courseId={course._id} courseTitle={course.title} />
                          </AssignmentDialogContent>
                        </AssignmentDialog>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!courses || courses.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="sm:max-w-[600px] max-h-[90vh] overflow-hidden"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()}>
            <CourseForm isEditing={true} />
          </form>

          <DialogFooter className="mt-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditCourse} 
                className="sm:ml-2"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
