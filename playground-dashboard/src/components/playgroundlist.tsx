import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

interface Playground {
  stadiumId: number;
  name: string;
  description: string;
  approvalStatus: 0 | 1;
  owner: {
    userName: string;
  };
  address: string;
}

const PlaygroundList: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [filteredPlaygrounds, setFilteredPlaygrounds] = useState<Playground[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("");

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Stadium`);
        setPlaygrounds(response.data);
        setFilteredPlaygrounds(response.data);
      } catch (error) {
        console.error("Error fetching playgrounds:", error);
      }
    };

    fetchPlaygrounds();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = playgrounds;

      // Filter by status
      if (statusFilter) {
        const statusValue = statusFilter === "active" ? 1 : 0;
        filtered = filtered.filter(playground => playground.approvalStatus === statusValue);
      }

      // Filter by city
      if (cityFilter) {
        filtered = filtered.filter(playground => playground.address.toLowerCase().includes(cityFilter.toLowerCase()));
      }

      setFilteredPlaygrounds(filtered);
    };

    applyFilters();
  }, [statusFilter, cityFilter, playgrounds]);

  const handleActivateClick = async (stadiumId: number) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Stadium/Active/${stadiumId}`);
      toast.success('Stadium activated successfully');
      setPlaygrounds(prevPlaygrounds =>
        prevPlaygrounds.map(playground =>
          playground.stadiumId === stadiumId ? { ...playground, approvalStatus: 1 } : playground
        )
      );
    } catch (error: any) {
      toast.error('Error activating stadium:', error);
    }
  };

  const handleDeactivateClick = async (stadiumId: number) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Stadium/UnActive/${stadiumId}`);
      toast.success('Stadium deactivated successfully');
      setPlaygrounds(prevPlaygrounds =>
        prevPlaygrounds.map(playground =>
          playground.stadiumId === stadiumId ? { ...playground, approvalStatus: 0 } : playground
        )
      );
    } catch (error: any) {
      toast.error('Error deactivating stadium:', error);
    }
  };

  const handleDeleteClick = async (stadiumId: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Stadium/Delete/${stadiumId}`);
      toast.success('Stadium deleted successfully');
      setPlaygrounds(prevPlaygrounds =>
        prevPlaygrounds.filter(playground => playground.stadiumId !== stadiumId)
      );
    } catch (error: any) {
      toast.error('Error deleting stadium:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4 flex-col md:flex-row">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* City Filter */}
        <input
          type="text"
          placeholder="Filter by city"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border rounded px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlaygrounds.map(playground => (
          <div key={playground.stadiumId} className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-2">
            <h3 className="text-xl font-semibold mb-2">Owner: {playground.owner.userName}</h3>
            <h3 className="text-xl font-semibold mb-2">Playground Name: {playground.name}</h3>
            <p className="text-gray-600 mb-4"> Description: {playground.description}</p>
            <p className="text-sm text-gray-500 mb-4">Status: {playground.approvalStatus === 1 ? 'Active' : 'Inactive'}</p>
            <p className="text-sm text-gray-500">Address: {playground.address}</p>
            <Link className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-32" to={`/playground/${playground.stadiumId}`}>
              View Details
            </Link>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                className={`text-white font-bold cursor-pointer px-3 py-2 rounded ${playground.approvalStatus === 1 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-green-600 bg-green-500'}`}
                onClick={() => handleActivateClick(playground.stadiumId)}
                disabled={playground.approvalStatus === 1}
              >
                Activate
              </button>
              <button
                className={`text-white font-bold cursor-pointer px-3 py-2 rounded ${playground.approvalStatus === 0 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-600 bg-red-500'}`}
                onClick={() => handleDeactivateClick(playground.stadiumId)}
                disabled={playground.approvalStatus === 0}
              >
                Un activate
              </button>
              <button
                className="hover:bg-gray-600 bg-gray-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
                onClick={() => handleDeleteClick(playground.stadiumId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaygroundList;
