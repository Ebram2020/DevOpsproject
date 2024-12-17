import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/navbar/navbar.com';
import Nav from '../components/nav/nav.comp';
import DisplayNumbers from '../components/numberCart/number-cart';
import humbrgerBar from "../assets/menu-icon.png";
import defaultAvatar from "../assets/avatar.png"; // Import default avatar image

interface PlayerDetailsProps {
    id: string;
    userName: string;
    birthDate: string;
    age: number;
    email: string;
    profilePictureUrl?: string;
    proofOfIdentityUrl?: string;
    wallet: number;
    pendingWallet: number;
    numberOfBookings: number;
    numberOfGames: number;
    favoriteStadiums: string[]; // Assuming it's an array of stadium names or IDs
    stadiumReservatation: string[]; // Assuming it's an array of stadium IDs
    ownerReservatation: string[]; // Assuming it's an array of stadium IDs for owner reservations
}

interface StadiumInfo {
    id: string;
    name: string;
    description: string;
}

interface OwnerInfo {
    userName: string;
    avatar?: string;
}

const PlayerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Access the player ID from URL params
    const [player, setPlayer] = useState<PlayerDetailsProps>();
    const [navbarIsHidden, setNavbarIsHidden] = useState(true);
    const [stadiumInfos, setStadiumInfos] = useState<StadiumInfo[]>([]);
    const [ownerInfo, setOwnerInfo] = useState<OwnerInfo[]>([]);
    const navigate = useNavigate();


    const navbarDisplayHandle = (bool: boolean) => {
        setNavbarIsHidden(bool);
    };

    useEffect(() => {
        const fetchPlayerDetails = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Player/${id}`);
                setPlayer(res.data);
                fetchStadiums(res.data.stadiumReservatation, res.data.ownerReservatation);
            } catch (error: any) {
                toast.error('Error fetching player details:', error);
            }
        };

        if (id) {
            fetchPlayerDetails();
        }
    }, [id]);

    const fetchStadiums = async (stadiumIds: string[], ownerStadiumIds: string[]) => {
        try {
            const stadiumRequests = stadiumIds.map(async (stadiumId) => {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Stadium/GetByStadiumId/${stadiumId}`);
                return res.data;
            });

            const ownerStadiumRequests = ownerStadiumIds.map(async (ownerStadiumId) => {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Owner/${ownerStadiumId}`);
                return res.data;
            });

            const stadiumResults = await Promise.all(stadiumRequests);
            const ownerStadiumResults = await Promise.all(ownerStadiumRequests);

            const allStadiumInfos = [...stadiumResults];
            const allOwnerInfos = [...ownerStadiumResults.map((owner) => ({
                userName: owner.userName,
                avatar: owner.avatar || defaultAvatar,
                statusName: owner.statusName // Adjust based on actual API response structure
            }))];

            setStadiumInfos(allStadiumInfos);
            setOwnerInfo(allOwnerInfos);
        } catch (error: any) {
            toast.error('Error fetching stadium details:', error);
        }
    };
    
    const birthDateFormate = (birthDate:string):string =>
    {
      const splitedArray = birthDate.split('-');
      const year:string = splitedArray[0];
      const month:string = splitedArray[1];
      const day:string = splitedArray[2][0] + splitedArray[2][1]; 
      return `${year} - ${month} - ${day}`;
    }
    const deleteHandle = async (id: string) => {
        try {
          const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Owner/Delete/${id}`);
    
          if (res.status === 200) {
            toast.success('The Owner deleted successfully');
            navigate(-1)
          } else {
            throw new Error("The Owner isn't deleted, try again");
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      };
    if (!player) {
        return <div>Loading...</div>;
    }

    // Default avatar image URL
    const avatarUrl = player.profilePictureUrl || defaultAvatar;

    return (
        <div className="flex gap-5 w-[100vw] min-h-[100vh] relative">
            <div className="w-8 h-8 ml-5 absolute mt-10 cursor-pointer xl:hidden">
                <img onClick={() => { navbarDisplayHandle(false) }} src={humbrgerBar} alt="humbBar" />
            </div>
            <Navbar closeNavbar={navbarDisplayHandle} isHidden={navbarIsHidden} />
            <div className="w-[100%] xl:w-[72%] 2xl:w-[78%] min-h-[100%] flex flex-col xl:absolute xl:right-10">
                <Nav />
                <div className="flex flex-col gap-20 w-[100%] p-10 bg-slate-100 absolute top-[150px]">
                    <div className="flex gap-5 mt-10">
                        <DisplayNumbers title="Revenue" number={player.wallet} sign="$" />
                        <DisplayNumbers title="Pending Wallet" number={player.pendingWallet} sign="$" />
                        <DisplayNumbers title="Number of Bookings" number={player.numberOfBookings} />
                        <DisplayNumbers title="Number of Games" number={player.numberOfGames} />
                    </div>
                    <div className="flex flex-col gap-5 p-5 bg-white rounded">
                        <h2 className="font-bold text-2xl border-b border-slate-400 pb-3">Player Info</h2>
                        <div className="flex justify-around items-center flex-wrap gap-5">
                            <div className="flex flex-col items-center">
                                <img className="w-20 h-20 rounded-full" src={avatarUrl} alt="avatar-image" />
                                <h2 className="font-bold text-xl">{player.userName}</h2>
                            </div>
                            <div className='flex flex-col gap-5'>
                                <p className="font-bold text-xl">
                                    Email: <span className="text-sm text-slate-500">{player.email}</span>
                                </p>

                                <p className="font-bold text-xl">
                                    Birth Date: <span className="text-sm text-slate-500">{birthDateFormate(player.birthDate)}</span>
                                </p>
                            </div>
                        </div>
                        {player.proofOfIdentityUrl && (
                            <div className="mt-5">
                                <a href={`${import.meta.env.VITE_BASE_URL}/${player.proofOfIdentityUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    View Proof of Identity
                                </a>
                            </div>
                        )}
                    </div>
                    {/* Display favorite stadiums */}
                    {player.favoriteStadiums.length > 0 && (
                        <div className="p-5 bg-white rounded">
                            <h2 className="font-bold text-2xl border-b border-slate-400 pb-3">Favorite Stadiums</h2>
                            <ul className="list-disc list-inside">
                                {player.favoriteStadiums.map((stadium, index) => (
                                    <li key={index} className="text-lg">{stadium}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Display stadium reservations */}
                    {stadiumInfos.length > 0 && (
                        <div className="p-5 bg-white rounded">
                            <h2 className="font-bold text-2xl border-b border-slate-400 pb-3">Stadium Reservations</h2>
                            <ul className="flex flex-col gap-5">
                                {stadiumInfos.map((stadium, index) => (
                                    <li className='border-b-2 border-gray-300'>
                                        <div key={index} className="p-4 rounded">
                                            <h3 className="font-bold text-xl">{stadium.name}</h3>
                                            <p className="text-gray-600">{stadium.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Display owner reservations */}
                    {ownerInfo.length > 0 && (
                        <div className="p-5 bg-white rounded">
                            <h2 className="font-bold text-2xl border-b border-slate-400 pb-3">Owner Reservations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {ownerInfo.map((owner, index) => (
                                    <div key={index} className="mt-5 border-b-2 border-gray-300 p-4 rounded flex flex-col items-center">
                                        <img className="w-14 h-14 rounded-full mb-2" src={owner.avatar || defaultAvatar} alt="owner-avatar" />
                                        <h3 className="font-bold text-xl">{owner.userName}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                     <button onClick={()=>{deleteHandle(player.id)}} className='w-40 px-8 py-3 cursor-pointer rounded bg-red-500 hover:bg-red-600 font-bold'>Delete</button>

                </div>
            </div>
        </div>
    );
};

export default PlayerDetails;
