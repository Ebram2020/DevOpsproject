import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StadiumData, Review } from '../types/playground.types';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar/navbar.com';
import Nav from '../components/nav/nav.comp';
import humbrgerBar from "../assets/menu-icon.png";
import toast from 'react-hot-toast';
import Feedback from '../components/owners/clients-feedback.comp';
import avatarIcon from "../assets/avatar.png";
import OpenTime from '../components/playground/open-time';
import DisplayImages from '../components/playground/display-images';
import StadiumOwnerDetails from '../components/playground/playground-owner-details';

const PlaygroundDetails: React.FC = () => {
    const [stadium, setStadium] = useState<StadiumData | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const { stadiumId } = useParams<{ stadiumId: string }>();
    const [navbarIsHidden, setNavbarIsHidden] = useState(true);
    const profilePictureUrl = stadium?.owner.ownerProfilePictureUrl ? `${import.meta.env.VITE_BASE_URL}/${stadium.owner.ownerProfilePictureUrl}` : avatarIcon;

    const navbarDisplayHandle = (bool: boolean) => {
        setNavbarIsHidden(bool);
    };

    useEffect(() => {
        const fetchStadiumData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Stadium/GetByStadiumId/${stadiumId}`);
                setStadium(response.data);
            } catch (error: any) {
                toast.error('Error fetching stadium data:', error);
            }
        };

        const fetchStadiumReviews = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Stadium/GetStadiumReviews/${stadiumId}`);
                setReviews(response.data.reviews);
            } catch (error: any) {
                toast.error('Error fetching stadium reviews:', error);
            }
        };

        fetchStadiumData();
        fetchStadiumReviews();
    }, [stadiumId]);

    if (!stadium) {
        return <div>Loading...</div>;
    }

    const handleOwnershipProofClick = () => {
        if (stadium.proofOfOwnershipUrl) {
            window.open(`${import.meta.env.VITE_BASE_URL}/${stadium.proofOfOwnershipUrl}`, '_blank');
        } else {
            toast.error('No proof of ownership available.');
        }
    };

    const handleActivateClick = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Stadium/Active/${stadiumId}`);
            toast.success('Stadium activated successfully');
            setStadium((prevStadium) => prevStadium ? { ...prevStadium, approvalStatus: 1 } : prevStadium);
        } catch (error: any) {
            toast.error('Error activating stadium:', error);
        }
    };

    const handleUnactivateClick = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Stadium/UnActive/${stadiumId}`);
            toast.success('Stadium deactivated successfully');
            setStadium((prevStadium) => prevStadium ? { ...prevStadium, approvalStatus: 0 } : prevStadium);
        } catch (error: any) {
            toast.error('Error deactivating stadium:', error);
        }
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Stadium/Delete/${stadiumId}`);
            toast.success('Stadium deleted successfully');
            // Redirect or perform other actions after deletion
        } catch (error: any) {
            toast.error('Error deleting stadium:', error);
        }
    };
    

    return (
        <>
            <div className="flex gap-5 w-[100vw] min-h-[100vh] relative">
                <div className="w-8 h-8 ml-5 absolute mt-10 cursor-pointer xl:hidden">
                    <img onClick={() => { navbarDisplayHandle(false) }} src={humbrgerBar} alt="humbBar" />
                </div>
                <Navbar closeNavbar={navbarDisplayHandle} isHidden={navbarIsHidden} />
                <div className="w-[100%] xl:w-[72%] 2xl:w-[78%] min-h-[100%] flex flex-col xl:absolute xl:right-10">
                    <Nav />
                    <div className="flex flex-col gap-20 w-[100%] p-10 bg-slate-100 absolute top-[150px]">
                        {/* First Row */}
                        <div className="sm:flex gap-5 sm:flex-col lg:flex-row items-center mb-4">
                            <div className="w-full sm:w-1/4 md:w-1/2 md:pr-4">
                                <img
                                    src={`${import.meta.env.VITE_BASE_URL}/${stadium.images[0]?.stadiumImageUrl}`}
                                    alt={stadium.name}
                                    className="rounded-lg mb-4 w-full"
                                />
                                <p className="text-gray-600">{stadium.description}</p>
                                <button
                                    className="hover:bg-blue-600 bg-blue-500 text-white font-bold cursor-pointer px-3 py-2 rounded mt-4"
                                    onClick={handleOwnershipProofClick}
                                >
                                    View Proof of Ownership
                                </button>
                            </div>
                            <StadiumOwnerDetails address={stadium.address} location={stadium.location} pricePerHour={stadium.pricePerHour} minHoursReservation={stadium.minHoursReservation} approvalStatus={stadium.approvalStatus} />
                        </div>

                        {/* Second Row */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Owner Details:</h2>
                            <div className="flex items-center gap-20 mt-4">
                                <div>
                                    <img
                                        src={profilePictureUrl}
                                        alt={stadium.owner.userName}
                                        className="rounded-full h-8 w-8 mr-2"
                                    />
                                    <p>{stadium.owner.userName}</p>
                                </div>
                                <button
                                    className="hover:bg-green-600 bg-green-500 text-white font-bold cursor-pointer px-3 py-2 rounded">
                                    <Link to={`/owner/${stadium.owner.ownerId}`}>View Owner Details</Link>
                                </button>
                            </div>
                        </div>
                        <OpenTime time={stadium.openTimes} />

                        {/* Fourth Row */}
                        <DisplayImages stadiumImages={stadium.images} />
                        <Feedback reviews={reviews} rate={stadium.rate} />
                        <div className="flex gap-4 mt-4">
                            <button
                                className={`text-white font-bold cursor-pointer px-3 py-2 rounded ${stadium.approvalStatus === 1 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-green-600 bg-green-500'}`}
                                onClick={handleActivateClick}
                                disabled={stadium.approvalStatus === 1}
                            >
                                Activate
                            </button>
                            <button
                                className={`text-white font-bold cursor-pointer px-3 py-2 rounded ${stadium.approvalStatus === 0 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-red-600 bg-red-500'}`}
                                onClick={handleUnactivateClick}
                                disabled={stadium.approvalStatus === 0}
                            >
                                Unactivate
                            </button>
                            <button
                                className="hover:bg-red-600 bg-red-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
                                onClick={handleDeleteClick}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlaygroundDetails;
