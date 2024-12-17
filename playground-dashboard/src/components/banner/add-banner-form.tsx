import React, { useState } from "react";
import Input from "../login/input.comp";
import toast from "react-hot-toast";
import axios from "axios";

const BannerForm = () => {
    const [image, setImage] = useState<File | null>(null);
    const [bannerImageUrl, setImageUrl] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUploadImage = async () => {
        if (!image) {
            toast.error('The image is required');
            return;
        }

        const formData = new FormData();
        formData.append('BannerImage', image);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Banner/UploadBannerImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setImageUrl(response.data.bannerImageUrl);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload image: ' + response.data.message);
            }
        } catch (error: any) {
            toast.error('Error uploading image: ' + error.message);
        }
    };

    const handleAddBanner = async () => {
        if (!bannerImageUrl) {
            toast.error("You must upload an image");
            return;
        }

        const bannerData = {
            bannerImageUrl: bannerImageUrl
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Banner/Add`, bannerData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast.success('Banner added successfully!');
                setImage(null);
                setImageUrl('');
            } else {
                toast.error('Failed to add Banner: ' + response.data.message);
            }
        } catch (error: any) {
            toast.error('Error adding Banner: ' + error.message);
        }
    };

    return (
        <div className={`w-[70vw] md:w-[50vw] bg-white rounded p-5 shadow-md transition-transform`}>
            <div className='relative flex justify-center'>
                <h2 className="text-2xl font-bold mb-4 text-center">Add Banner</h2>
            </div>
            <form className="flex flex-col gap-5 justify-center">
                <Input type="file" name="category-image" label="Upload Image" accept="image/*" handleOnChange={handleImageChange} />
                <button type="button" className="rounded w-60 px-4 py-2 bg-green-500 hover:bg-green-600 font-bold text-white" onClick={handleUploadImage}>Upload Image</button>
                <button type="button" className="rounded w-60 px-4 py-2 bg-blue-500 hover:bg-blue-600 font-bold text-white" onClick={handleAddBanner}>Add Banner</button>
            </form>
        </div>
    );
};

export default BannerForm;
