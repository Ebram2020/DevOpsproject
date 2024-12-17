import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the Admin interface
interface Admin {
  username: string;
  wallet: any;
}

// Define the context type
interface AdminContextType {
  admin: Admin | null;
  setAdmin: (admin: Admin) => void;
}

// Default values for the context
const defaultValue: AdminContextType = {
  admin: null,
  setAdmin: () => {},
};

// Create the context with default values and types
const AdminContext = createContext<AdminContextType>(defaultValue);

// Define the provider component's props
interface AdminProviderProps {
  children: ReactNode; // ReactNode allows for child components
}

// Provider component to manage state
const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdminState] = useState<Admin | null>(null);

  const setAdmin = (admin: Admin) => {
    setAdminState(admin);
    localStorage.setItem('admin', JSON.stringify(admin)); // Store admin details in localStorage
  };

  // Load admin from localStorage when the component mounts
  React.useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdminState(JSON.parse(storedAdmin));
    }
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook for easier context usage
const useAdmin = () => {
  return useContext(AdminContext);
};

export { AdminProvider, useAdmin };
