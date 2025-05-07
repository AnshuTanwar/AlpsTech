import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { createUser, findUserByEmail, updateUserEnrollment, User, UserWithPassword } from "@/services/userService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  enrollInCourse: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users] = useState<User[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const foundUser = await findUserByEmail(email);

      if (foundUser && foundUser.password === password) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser = await createUser({
        name,
        email,
        password,
        role: "student",
        enrolledCourses: [],
        results: [],
      });

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success(`Welcome to AlpsTech, ${name}!`);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        toast.error("Email already registered. Please use a different email.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return;

    try {
      const success = await updateUserEnrollment(user.id, courseId);
      
      if (success) {
        const updatedUser = {
          ...user,
          enrolledCourses: [...(user.enrolledCourses || []), courseId],
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("You've successfully enrolled in this course!");
      } else {
        toast.error("Failed to enroll in the course");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course");
    }
  };

  const isEnrolled = (courseId: string) => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.includes(courseId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      users,
      enrollInCourse,
      isEnrolled
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
