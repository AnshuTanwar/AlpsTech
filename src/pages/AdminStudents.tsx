import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingBar } from "@/components/ui/loading-bar";
import { getAllStudents, getStudentEnrollments } from "@/services/studentService";
import type { Student, StudentEnrollment } from "@/services/studentService";

const AdminStudents = () => {
  const { 
    data: students, 
    isLoading: isStudentsLoading 
  } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: getAllStudents
  });

  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading
  } = useQuery<StudentEnrollment[]>({
    queryKey: ['studentEnrollments'],
    queryFn: getStudentEnrollments
  });

  const isLoading = isStudentsLoading || isEnrollmentsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <LoadingBar 
          className="w-64"
          progress={100}
          variant="primary"
        />
        <p className="text-muted-foreground">Loading student data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Students Management</h1>
        <p className="text-gray-600 dark:text-gray-300">View and manage students enrolled in courses</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Students ({students?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Enrolled Courses</th>
                  <th scope="col" className="px-6 py-3">Results</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <tr key={student._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium">{student.name}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.enrolledCourses.length}</td>
                    <td className="px-6 py-4">{student.results.length}</td>
                  </tr>
                ))}
                {(!students || students.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Student</th>
                  <th scope="col" className="px-6 py-3">Course</th>
                  <th scope="col" className="px-6 py-3">Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {enrollments?.map((enrollment) => (
                  <tr key={enrollment._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium">{enrollment.student.name}</td>
                    <td className="px-6 py-4">{enrollment.course.title}</td>
                    <td className="px-6 py-4">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!enrollments || enrollments.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-muted-foreground">
                      No enrollments found
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

export default AdminStudents;
