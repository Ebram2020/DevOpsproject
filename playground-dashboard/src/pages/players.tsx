import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/navbar.com';
import DisplayNumbers from '../components/numberCart/number-cart';
import Nav from '../components/nav/nav.comp';
import humbrgerBar from '../assets/menu-icon.png';
import { PlayersContext } from '../context/playersContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlayersDisplay: React.FC = () => {
  const [navbarIsHidden, setNavbarIsHidden] = useState(true);
  const { displayedPlayers, loadMorePlayers, fetchPlayers, totalPlayers } = useContext(PlayersContext);
  const navigate = useNavigate();

  const navbarDisplayHandle = () => {
    setNavbarIsHidden(!navbarIsHidden);
  };

  const viewHandle = (id: string) => {
    navigate(`/player/${id}`);
  };

  const unActive = async (id: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Player/UnActive/${id}`);

      if (res.status === 200) {
        toast.success('The Player Deleted Successfully');
        fetchPlayers(); // Refresh the player list after unactivating a player
      } else {
        throw new Error("The Player isn't deleted, try again");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const viewProofIdentifier = (url?: string) => {
    if (url) {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;
      window.open(fullUrl, '_blank');
    } else {
      toast.error('Proof of Identity not available');
    }
  };

  const activatePlayer = async (id: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Player/Active/${id}`);

      if (res.status === 200) {
        toast.success('The Player Activated Successfully');
        fetchPlayers(); // Refresh the player list after activating a player
      } else {
        throw new Error("The Player isn't activated, try again");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlayers(); // Fetch players when the component mounts
  }, []);

  const handleLoadMore = () => {
    const morePlayersLoaded = loadMorePlayers();
    if (!morePlayersLoaded) {
      toast('No more players to load', { icon: '🚫' });
    }
  };

  return (
    <div className="flex gap-5 w-full min-h-screen relative">
      <div className="w-8 h-8 ml-5 absolute mt-10 cursor-pointer xl:hidden">
        <img onClick={() => navbarDisplayHandle()} src={humbrgerBar} alt="menu-icon" />
      </div>
      <Navbar closeNavbar={navbarDisplayHandle} isHidden={navbarIsHidden} />

      <div className="w-full xl:w-[72%] 2xl:w-[78%] min-h-full flex flex-col xl:absolute xl:right-10">
        <Nav />
        <div className="flex flex-col gap-20 w-full p-10 bg-slate-100 absolute top-[150px]">
          <div className="w-full flex gap-5 mt-20">
            <DisplayNumbers title="Players" number={totalPlayers} />
          </div>

          <div className="container mx-auto bg-white rounded py-3">
            <div className="overflow-x-auto">
              <h2 className="font-bold text-slate-400 p-3">All Players</h2>
              <table className="table-auto min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proof of Identity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(displayedPlayers) ? (
                    displayedPlayers.map((player) => (
                      <tr key={player.playerId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {player.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {player.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {player.proofOfIdentityUrl ? (
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => viewProofIdentifier(player.proofOfIdentityUrl)}
                            >
                              View
                            </button>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="flex gap-3 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className={`px-6 py-3 font-bold rounded text-white ${
                              player.approvalStatus ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            onClick={() => unActive(player.playerId)}
                            disabled={!player.approvalStatus}
                          >
                            UnActive
                          </button>
                          <button
                            className={`px-6 py-3 font-bold rounded text-white bg-green-600 hover:bg-green-800`}
                            onClick={() => viewHandle(player.playerId)}
                          >
                            View
                          </button>
                          <button
                            className={`px-6 py-3 font-bold rounded text-white ${
                              !player.approvalStatus ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            onClick={() => activatePlayer(player.playerId)}
                            disabled={player.approvalStatus}
                          >
                            Activate
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className='font-bold text-xl text-center' colSpan={4}>Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="hover:bg-green-600 bg-green-500 rounded px-5 py-3 font-bold text-white"
            >
              More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersDisplay;
