import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Navbar from "../components/navbar/navbar.com";
import DisplayNumbers from "../components/numberCart/number-cart";
import TableHead from "../components/table/head.comp";
import OwnerRow from "../components/table/row.comp";
import humbrgerBar from "../assets/menu-icon.png";
import Nav from "../components/nav/nav.comp";
import toast from 'react-hot-toast';
import { OwnersContext } from "../context/ownersContext";
import ActiveForm from "../components/active-form";// Import the Modal component

const UsersActivation: React.FC = () => {
    const [navbarIsHidden, setNavbarIsDisplay] = useState(true);
    const [owners, setOwners] = useState<any[]>([]); // State to hold owners data
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null); // State to store selected owner ID
    const { totalOwners, fetchOwners } = useContext(OwnersContext);
    useEffect(() => {
        fetchOwners();
    }, [fetchOwners]);

    const fetchOwners2 = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Owner`, {
                params: {
                    approvalStatus: false
                }
            });

            if (response.status === 200) {
                setOwners(response.data); // Set owners data in state
            } else {
                throw new Error('Failed to fetch owners');
            }
        } catch (error:any) {
            toast.error('Error fetching owners:', error);
        }
    };

    useEffect(() => {
        fetchOwners2(); // Fetch owners on component mount
    }, []);

    const navbarDisplayHandle = (bool: boolean) => {
        setNavbarIsDisplay(bool);
    };

    const viewHandle = () => {
        console.log("Display");
    };

    const handleActivateClick = (id: string) => {
        setSelectedOwnerId(id);
        setIsModalOpen(true);
    };

    const activateHandle = async (supplierCode: string) => {
        if (!selectedOwnerId) return;

        try {
            const activeBody = {
                supplierCode
            };
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Owner/Active/${selectedOwnerId}`, activeBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast.success("Owner activated successfully");
                // Remove the activated owner from the state
                setOwners(prevOwners => prevOwners.filter(owner => owner.ownerId !== selectedOwnerId));
                setIsModalOpen(false);
                setSelectedOwnerId(null);
            } else {
                throw new Error('Failed to activate owner');
            }
        } catch (error:any) {
            toast.error('Error activating owner:', error);
        }
    };

    // const unActivateHandle = async (id: string) => {
    //     try {
    //         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Owner/UnActive/${id}`);

    //         if (response.status === 200) {
    //             console.log("Owner deleted successfully");
    //             // Remove deleted owner from state
    //             setOwners(prevOwners => prevOwners.filter(owner => owner.ownerId !== id));
    //             toast.success('Owner deleted successfully');
    //         } else {
    //             throw new Error('Failed to delete owner');
    //         }
    //     } catch (error:any) {
    //         console.error('Error deleting owner:', error);
    //         toast.error('Failed to delete owner');
    //     }
    // };

    const viewProofIdentifier = (url: string) => {
        const baseUrl = import.meta.env.VITE_BASE_URL; // Your server base URL
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;
        window.open(fullUrl, '_blank');
    };

    return (
        <div className="flex gap-5 w-[100vw] min-h-[100vh] relative">
            <div className="w-8 h-8 ml-5 absolute mt-10 cursor-pointer xl:hidden">
                <img onClick={() => navbarDisplayHandle(false)} src={humbrgerBar} alt="humbBar" />
            </div>
            <Navbar closeNavbar={navbarDisplayHandle} isHidden={navbarIsHidden} />

            <div className="w-[100%] xl:w-[72%] 2xl:w-[78%] min-h-[100%] flex flex-col xl:absolute xl:right-10">
                <Nav />
                <div className="flex flex-col gap-20 w-[100%] p-10 bg-slate-100 absolute top-[150px]">
                    <div className="w-[100%] flex gap-5 mt-20">
                        <DisplayNumbers title="Owners" number={totalOwners} />
                    </div>

                    <div className="container mx-auto bg-white rounded py-3">
                        <div className="overflow-x-auto">
                            <h2 className="font-bold text-slate-400 p-3">All Owners</h2>
                            <table className="table-auto min-w-full">
                                <TableHead
                                    label1="Name"
                                    label2="Email"
                                    label3="Proof of Identity"
                                    label7="Actions"
                                />
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {owners.map(owner => (
                                        <OwnerRow
                                            key={owner.ownerId}
                                            id={owner.ownerId}
                                            label1={owner.userName}
                                            label2={owner.email}
                                            label3={owner.proofOfIdentityUrl}
                                            activate={() => handleActivateClick(owner.ownerId)}
                                            // delete={() => unActivateHandle(owner.ownerId)}
                                            viewProofIdentifier={() => viewProofIdentifier(owner.proofOfIdentityUrl)}
                                            view={viewHandle}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ActiveForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={activateHandle}
            />
        </div>
    );
};

export default UsersActivation;
