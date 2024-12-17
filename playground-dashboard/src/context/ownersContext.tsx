import { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Define the Owner interface
interface Owner {
  ownerId: string;
  userName: string;
  email: string;
  proofOfIdentityUrl?: string;
  phone?: string;
  location?: string;
  profilePictureUrl?: string;
  wallet?: number;
  rate?: number;
  review?: [];
}

// Define the context type
interface OwnersContextType {
  owners: Owner[];
  displayedOwners: Owner[];
  currentPage: number;
  latestTenOwners: Owner[];
  totalOwners: number;
  loadMoreOwners: () => boolean;
  storeOwners: (newOwners: Owner[]) => void;
  fetchOwners: () => void;
}

// Default values for the context
const defaultValue: OwnersContextType = {
  owners: [],
  displayedOwners: [],
  latestTenOwners: [],
  currentPage: 1,
  totalOwners: 0,
  loadMoreOwners: ():any => { },
  storeOwners: () => { },
  fetchOwners: () => { },
};

// Create the context with default values and types
const OwnersContext = createContext<OwnersContextType>(defaultValue);

// Define the provider component's props
interface OwnersProviderProps {
  children: ReactNode; // ReactNode allows for child components
}

// Provider component to manage state
const OwnersProvider = ({ children }: OwnersProviderProps) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedOwners, setDisplayedOwners] = useState<Owner[]>([]);
  const [latestTenOwners, setLatestTenOwners] = useState<Owner[]>([]);
  const [totalOwners, setTotalOwners] = useState<number>(0);

  // Function to store owners in the state
  const storeOwners = (newOwners: Owner[]) => {
    setOwners(newOwners);

    // Initialize displayedOwners with the first 10 owners
    if (newOwners.length > 0) {
      setDisplayedOwners(newOwners.slice(0, 10));
      setCurrentPage(1); // Reset current page
      setLatestTenOwners(newOwners.slice(0, 10));
    }
  };

  // Function to fetch owners from the server
  const fetchOwners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Owner`, {
        params: {
          approvalStatus: true
        }
      });
      if (response.status === 200) {
        storeOwners(response.data);
      } else {
       toast.error('Failed to fetch owners:', response.data.message);
      }
    } catch (error: any) {
      toast.error('Error fetching owners:', error.message);
    }
  };

  // Function to load more owners
  const loadMoreOwners = ():boolean => {
    const newPage = currentPage + 1;
    const start = (newPage - 1) * 10;
    const newOwners = owners.slice(start, start + 10);


    if (newOwners.length === 0) {
      return false;
    }

    setDisplayedOwners((prev) => [...prev, ...newOwners]);
    setCurrentPage(newPage);

    return true;
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    // Calculate the total number of owners whenever the owners state changes
    setTotalOwners(owners.length);
  }, [owners]);

  return (
    <OwnersContext.Provider
      value={{
        owners,
        displayedOwners,
        latestTenOwners,
        currentPage,
        totalOwners,
        loadMoreOwners,
        storeOwners,
        fetchOwners
      }}
    >
      {children}
    </OwnersContext.Provider>
  );
};

export { OwnersContext, OwnersProvider };
