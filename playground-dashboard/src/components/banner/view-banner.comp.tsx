import React, { useEffect, useState } from 'react';
import axios from 'axios';

import deleteImage from "../../assets/close-icon.png";
import toast from 'react-hot-toast';

const ViewBanner: React.FC = () => {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Banner`);
            setBanners(response.data);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: string, url: string) => {
        try {
            const deleteImageResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Banner/DeleteBannerImage`, {
                bannerImageUrl: url
            });

            if (deleteImageResponse.status === 200) {
                const deleteBannerResponse = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Banner/Delete/${id}`);
                if (deleteBannerResponse.status === 200) {
                    toast.success('Banner Deleted');
                    setBanners(banners.filter(banner => banner.bannerId !== id));
                } else {
                    throw new Error("Error occurred while deleting the banner.");
                }
            } else {
                throw new Error("Error occurred while deleting the banner image.");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(()=>{
      fetchBanners();
    }, [])

    return (
        <div>
                <div className="bg-white p-5 transition-transform w-[70vw]">
                    <div>
                        <div className='relative flex justify-center'>
                            <h2 className="text-2xl font-bold mb-4 text-center">Banners</h2>
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {banners.map(banner => (
                                    <div key={banner.bannerId} className="relative group">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}/${banner.bannerImageUrl}`}
                                            alt="banner-image"
                                            className="h-32 w-full object-cover rounded"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="bg-red-500 text-white p-2 rounded-full"
                                                onClick={() => deleteCategory(banner.bannerId, banner.bannerImageUrl)}
                                            >
                                                <img src={deleteImage} alt="delete-icon" className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default ViewBanner;
