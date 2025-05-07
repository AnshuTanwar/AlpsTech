import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingBar } from "@/components/ui/loading-bar";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { getDashboardStats, getRecentEnrollments, getLatestResults } from "@/services/dashboardService";
import type { DashboardStats, Enrollment, Result } from "@/services/dashboardService";

const AdminDashboard = () => {
  const { theme } = useTheme();

  const { 
    data: stats, 
    isLoading: isStatsLoading 
  } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  const {
    data: recentEnrollments,
    isLoading: isEnrollmentsLoading
  } = useQuery<Enrollment[]>({
    queryKey: ['recentEnrollments'],
    queryFn: getRecentEnrollments
  });

  const {
    data: latestResults,
    isLoading: isResultsLoading
  } = useQuery<Result[]>({
    queryKey: ['latestResults'],
    queryFn: getLatestResults
  });

  const isLoading = isStatsLoading || isEnrollmentsLoading || isResultsLoading;

  const getGradeBadgeStyle = (grade: string) => {
    if (theme === "dark") {
      switch (grade) {
        case "A":
        case "A+":
          return "bg-green-700 text-white font-medium";
        case "B":
        case "B+":
          return "bg-blue-700 text-white font-medium";
        case "C":
        case "C+":
          return "bg-yellow-700 text-white font-medium";
        case "D":
          return "bg-orange-700 text-white font-medium";
        case "F":
          return "bg-red-700 text-white font-medium";
        default:
          return "bg-gray-700 text-white font-medium";
      }
    } else {
      switch (grade) {
        case "A":
        case "A+":
          return "bg-green-100 text-green-800";
        case "B":
        case "B+":
          return "bg-blue-100 text-blue-800";
        case "C":
        case "C+":
          return "bg-yellow-100 text-yellow-800";
        case "D":
          return "bg-orange-100 text-orange-800";
        case "F":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <LoadingBar 
          className="w-64"
          progress={100}
          variant="primary"
        />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Overview of the computer center's statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Courses</CardTitle>
            <CardDescription>
              Number of courses offered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats?.totalCourses || 0}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/courses">Manage Courses</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
            <CardDescription>
              Registered students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats?.totalStudents || 0}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/students">View Students</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Results</CardTitle>
            <CardDescription>
              Recorded assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats?.totalResults || 0}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/results">Manage Results</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Enrollments</CardTitle>
            <CardDescription>
              Courses with open enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats?.openEnrollments || 0}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/courses">View Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>
              Latest student enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments?.map((enrollment) => (
                <div key={enrollment._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{enrollment.user[0]?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled in {enrollment.course[0]?.title}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(!recentEnrollments || recentEnrollments.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No recent enrollments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Results</CardTitle>
            <CardDescription>
              Recently uploaded results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestResults?.map((result) => (
                <div key={result._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{result.user[0]?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.course[0]?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {result.score}/{result.maxScore}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      getGradeBadgeStyle(result.grade)
                    )}>
                      Grade: {result.grade}
                    </span>
                  </div>
                </div>
              ))}
              {(!latestResults || latestResults.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No results available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
