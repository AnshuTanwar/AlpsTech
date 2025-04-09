
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  enrolledCourses?: string[]; 
  results?: string[]; 
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[]; 
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const initialUsers = [
  {
    id: "1",
    name: "Student User",
    email: "student@example.com",
    password: "password123",
    role: "student" as const,
    enrolledCourses: ["1", "2", "5"], 
    results: ["1", "2", "3"], 
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    enrolledCourses: [],
    results: [],
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [usersWithPasswords, setUsersWithPasswords] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : initialUsers;
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const usersWithoutPasswords = usersWithPasswords.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(usersWithPasswords));
  }, [usersWithPasswords]);

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = usersWithPasswords.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const emailExists = usersWithPasswords.some(user => user.email === email);
      if (emailExists) {
        toast.error("Email already registered. Please use a different email.");
        setIsLoading(false);
        return false;
      }
      
      const newUser = {
        id: (usersWithPasswords.length + 1).toString(),
        name,
        email,
        password,
        role: "student" as const,
        enrolledCourses: [], 
        results: [], 
      };
      
    
      setUsersWithPasswords(prevUsers => [...prevUsers, newUser]);
      

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome to AlpsTech, ${name}!`);
      return true;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
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
  const enrollInCourse = (courseId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      enrolledCourses: [...(user.enrolledCourses || []), courseId],
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    const updatedUsers = usersWithPasswords.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          enrolledCourses: [...(u.enrolledCourses || []), courseId],
        };
      }
      return u;
    });
    
    setUsersWithPasswords(updatedUsers);
    toast.success("You've successfully enrolled in this course!");
  };

  // Function to check if a user is enrolled in a course
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
      users: usersWithoutPasswords,
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
