import { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

// Define the Player interface
interface Player {
  playerId: string;
  userName: string;
  email: string;
  proofOfIdentityUrl?: string;
  location?: string;
  profilePictureUrl?: string;
  wallet?: number;
  pendingWallet: number;
  numberOfBookings: number;
  numberOfGames: number;
  approvalStatus: boolean;
  favoriteStadiums: [];
  stadiumReservation: [];
  ownerReservation: [];
}

// Define the context type
interface PlayerContextType {
  players: Player[];
  displayedPlayers: Player[];
  currentPage: number;
  latestTenPlayers: Player[];
  totalPlayers: number;
  isLoading: boolean;
  loadMorePlayers: () => boolean;
  storePlayers: (newPlayers: Player[]) => void;
  fetchPlayers: (approvalStatus?: boolean) => void;
}

// Default values for the context
const defaultValue: PlayerContextType = {
  players: [],
  displayedPlayers: [],
  latestTenPlayers: [],
  currentPage: 1,
  totalPlayers: 0,
  isLoading: false,
  loadMorePlayers: ():any => { },
  storePlayers: () => { },
  fetchPlayers: () => { },
};

// Create the context with default values and types
const PlayersContext = createContext<PlayerContextType>(defaultValue);

// Define the provider component's props
interface PlayerProviderProps {
  children: ReactNode; // ReactNode allows for child components
}

// Provider component to manage state
const PlayersProvider = ({ children }: PlayerProviderProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
  const [latestTenPlayers, setLatestTenPlayers] = useState<Player[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to store players in the state
  const storePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);

    // Initialize displayedPlayers with the first 10 players
    if (newPlayers.length > 0) {
      setDisplayedPlayers(newPlayers.slice(0, 10));
      setCurrentPage(1); // Reset current page
      setLatestTenPlayers(newPlayers.slice(0, 10));
    }
  };

  // Function to fetch players from the server
  const fetchPlayers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Player`);
      if (response.status === 200) {
        storePlayers(response.data);
      } else {
        console.error('Failed to fetch players:', response.data.message);
      }
    } catch (error: any) {
      console.error('Error fetching players:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load more players
  const loadMorePlayers = (): boolean => {
    const newPage = currentPage + 1;
    const start = (newPage - 1) * 10;
    const newPlayers = players.slice(start, start + 10);

    if (newPlayers.length === 0) {
      return false;
    }

    setDisplayedPlayers((prev) => [...prev, ...newPlayers]);
    setCurrentPage(newPage);

    return true;
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    // Calculate the total number of players whenever the players state changes
    setTotalPlayers(players.length);
  }, [players]);

  return (
    <PlayersContext.Provider
      value={{
        players,
        displayedPlayers,
        latestTenPlayers,
        currentPage,
        totalPlayers,
        isLoading,
        loadMorePlayers,
        storePlayers,
        fetchPlayers,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export { PlayersContext, PlayersProvider };
