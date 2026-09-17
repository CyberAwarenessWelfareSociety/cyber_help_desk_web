import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type SubscriptionTier = "none" | "basic" | "premium" | "ultimate";

interface User {
  id: string;
  email: string;
  name: string;
  subscription: SubscriptionTier;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateSubscription: (tier: SubscriptionTier) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("meetapp_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("meetapp_users") || "{}");
    const userData = users[email];

    if (!userData) {
      return { success: false, error: "User not found. Please sign up first." };
    }

    if (userData.password !== password) {
      return { success: false, error: "Incorrect password." };
    }

    const loggedInUser: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      subscription: userData.subscription || "none",
    };

    setUser(loggedInUser);
    localStorage.setItem("meetapp_user", JSON.stringify(loggedInUser));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("meetapp_users") || "{}");

    if (users[email]) {
      return { success: false, error: "User already exists. Please login." };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      subscription: "none" as SubscriptionTier,
    };

    users[email] = newUser;
    localStorage.setItem("meetapp_users", JSON.stringify(users));

    const loggedInUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      subscription: newUser.subscription,
    };

    setUser(loggedInUser);
    localStorage.setItem("meetapp_user", JSON.stringify(loggedInUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("meetapp_user");
  };

  const updateSubscription = (tier: SubscriptionTier) => {
    if (!user) return;

    const updatedUser = { ...user, subscription: tier };
    setUser(updatedUser);
    localStorage.setItem("meetapp_user", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("meetapp_users") || "{}");
    if (users[user.email]) {
      users[user.email].subscription = tier;
      localStorage.setItem("meetapp_users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
