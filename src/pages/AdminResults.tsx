import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAllResults, createResult, updateResult, deleteResult, type Result } from "@/services/resultService";
import { getAllCourses, type Course } from "@/services/courseService";

const AdminResults = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newResult, setNewResult] = useState<Omit<Result, "_id">>({
    studentEmail: "",
    studentName: "",
    courseId: "",
    courseName: "",
    score: 0,
    maxScore: 100,
    grade: "C",
    date: new Date().toISOString().split("T")[0],
    feedback: ""
  });

  // Fetch results and courses
  const { data: results = [], isLoading: isLoadingResults } = useQuery({
    queryKey: ['results'],
    queryFn: getAllResults
  });

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      setIsAddDialogOpen(false);
      toast.success("Result added successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add result");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Result> }) => 
      updateResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast.success("Result updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update result");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast.success("Result deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete result");
    }
  });

  // Filter results
  const filteredResults = results.filter((result) => {
    const matchesSearch = 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === "all" || result.courseId === courseFilter;
    const matchesGrade = gradeFilter === "all" || result.grade === gradeFilter;
    
    return matchesSearch && matchesCourse && matchesGrade;
  });

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    setNewResult({
      ...newResult,
      courseId,
      courseName: course ? course.title : "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewResult({
      ...newResult,
      [name]: ["score", "maxScore"].includes(name) ? parseInt(value) || 0 : value,
    });
  };

  const calculateGrade = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "C+";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value) || 0;
    const maxScore = newResult.maxScore;
    const grade = calculateGrade(score, maxScore);
    
    setNewResult({
      ...newResult,
      score,
      grade,
    });
  };

  const handleAddResult = () => {
    createMutation.mutate(newResult);
  };

  const handleEditResult = (id: string, data: Partial<Result>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoadingResults || isLoadingCourses) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Results</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload and manage student results</p>
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
              Add New Result
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Result</DialogTitle>
              <DialogDescription>
                Enter the details for the new result
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="studentEmail">Student Email</Label>
                <Input
                  id="studentEmail"
                  name="studentEmail"
                  type="email"
                  value={newResult.studentEmail}
                  onChange={handleInputChange}
                  placeholder="Enter student email"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={newResult.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="courseId">Course</Label>
                <Select
                  value={newResult.courseId}
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  name="score"
                  type="number"
                  value={newResult.score}
                  onChange={handleScoreChange}
                  min={0}
                  max={newResult.maxScore}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  value={newResult.maxScore}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={newResult.feedback}
                  onChange={handleInputChange}
                  placeholder="Enter feedback"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResult}>Add Result</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Search</Label>
                <Input
                  placeholder="Search by student or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-48">
                <Label>Filter by Course</Label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-48">
                <Label>Filter by Grade</Label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {["A+", "A", "B+", "B", "C+", "C", "D", "F"].map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Student</th>
                  <th scope="col" className="px-6 py-3">Course</th>
                  <th scope="col" className="px-6 py-3">Score</th>
                  <th scope="col" className="px-6 py-3">Grade</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-medium">{result.studentName}</div>
                      <div className="text-xs text-gray-500">{result.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4">{result.courseName}</td>
                    <td className="px-6 py-4">{result.score}/{result.maxScore}</td>
                    <td className="px-6 py-4">{result.grade}</td>
                    <td className="px-6 py-4">{new Date(result.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        className="mr-2"
                        onClick={() => handleEditResult(result._id, result)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteResult(result._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResults;
