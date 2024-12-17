import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import closeIcon from "../../assets/close-icon.png";
import { Link } from 'react-router-dom';

interface PlayGround {
    stadiumId: string;
    name: string;
    pricePerHour: number;
    location: string;
    description: string;
    minHoursReservation: number;
    openTimes: { dayOfWeek: number; startTime: string; endTime: string }[];
    approvalStatus: boolean;
}

interface PlayGroundViewProps {
    playgrounds: PlayGround[];
}

const PlayGroundView: React.FC<PlayGroundViewProps> = ({ playgrounds: initialPlaygrounds }) => {
    const [playgrounds, setPlaygrounds] = useState<PlayGround[]>(initialPlaygrounds);
    const [expandedTimes, setExpandedTimes] = useState<{ dayOfWeek: number; startTime: string; endTime: string }[]>([]);

    const unActivateHandle = async (id: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Stadium/UnActive/${id}`);
            if (response.status === 200) {
                setPlaygrounds(prevPlaygrounds =>
                    prevPlaygrounds.map(playground =>
                        playground.stadiumId === id ? { ...playground, approvalStatus: false } : playground
                    )
                );
                toast.success('Playground deactivated successfully');
            } else {
                toast.error('Failed to deactivate playground');
            }
        } catch (error: any) {
            toast.error('Error deactivating playground: ' + error.message);
        }
    };

    const activateHandle = async (id: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Stadium/Active/${id}`);
            if (response.status === 200) {
                setPlaygrounds(prevPlaygrounds =>
                    prevPlaygrounds.map(playground =>
                        playground.stadiumId === id ? { ...playground, approvalStatus: true } : playground
                    )
                );
                toast.success('Playground activated successfully');
            } else {
                toast.error('Failed to activate playground');
            }
        } catch (error: any) {
            toast.error('Error activating playground: ' + error.message);
        }
    };

    const formatDayOfWeek = (dayOfWeek: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    };

    const toggleExpandedTimes = (times: { dayOfWeek: number; startTime: string; endTime: string }[]) => {
        setExpandedTimes(times);
    };

    const closeExpandedTimes = () => {
        setExpandedTimes([]);
    };

    return (
        <div className="container mx-auto bg-white rounded py-3">
            <div className="overflow-x-auto">
                <h2 className="font-bold text-slate-400 p-3">All PlayGrounds</h2>
                <table className="table-auto min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Price/Hour</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Min Hours Reservation</th>
                            <th className="px-4 py-2">Open Times</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {playgrounds.length > 0 ? (
                            playgrounds.map((playground) => (
                                <tr key={playground.stadiumId}>
                                    <td className="pl-10 py-2">{playground.name}</td>
                                    <td className="pl-16 py-2">{playground.pricePerHour}</td>
                                    <td className="pl-16 py-2">{playground.location}</td>
                                    <td className="pl-16 py-2">{playground.minHoursReservation}</td>
                                    <td className="pl-16 py-2">
                                        {playground.openTimes.slice(0, 1).map((openTime, index) => (
                                            <div key={index}>
                                                {formatDayOfWeek(openTime.dayOfWeek)}: {openTime.startTime} - {openTime.endTime}
                                            </div>
                                        ))}
                                        {expandedTimes.length > 0 && (
                                            <div className="absolute bottom-96 right-0 p-5 w-[70vw] md:w-[50wv] lg:w-[30vw] bg-white shadow-md rounded-md mt-5">
                                                <div className="flex justify-end">
                                                    <button className="text-red-500" onClick={closeExpandedTimes}>
                                                        <img src={closeIcon} alt='playgrounds-open-time' className="h-6 w-6"/>
                                                    </button>
                                                </div>
                                                <h3 className="font-bold text-lg mb-3">All Open Times</h3>
                                                {expandedTimes.map((time, index) => (
                                                    <div key={index}>
                                                        {formatDayOfWeek(time.dayOfWeek)}: {time.startTime} - {time.endTime}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {playground.openTimes.length > 1 && (
                                            <button className="text-blue-500 mt-2" onClick={() => toggleExpandedTimes(playground.openTimes)}>
                                                View All
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        {playground.approvalStatus ? (
                                            <button
                                                onClick={() => unActivateHandle(playground.stadiumId)}
                                                className="hover:bg-red-600 bg-red-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
                                            >
                                                Unactivate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => activateHandle(playground.stadiumId)}
                                                className="hover:bg-blue-600 bg-blue-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
                                            >
                                                Activate
                                            </button>
                                        )}
                                        <button
                                            className="hover:bg-green-600 bg-green-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
                                        >
                                            <Link to={`/playground/${playground.stadiumId}`}>View</Link>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center font-bold text-xl py-5">
                                    PlayGrounds Not Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayGroundView;
