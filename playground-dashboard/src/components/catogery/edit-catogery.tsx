import React, { useState, useEffect } from "react";
import Input from "../login/input.comp";
import toast from "react-hot-toast";
import axios from "axios";

interface CategoryFormProps {
    category?: any;
    onUpdate: (updatedCategory: any) => void;
    onCancel: () => void; // Added cancel prop
}

const EditCategory: React.FC<CategoryFormProps> = ({ category,onUpdate, onCancel }) => {
    const [image, setImage] = useState<File | null>(null);
    const [categoryImageUrl, setImageUrl] = useState<string>(category ? category.categoryImageUrl : '');
    const [nameAr, setNameAr] = useState<string>(category ? category.categoryNameAr : '');
    const [nameEn, setNameEn] = useState<string>(category ? category.categoryNameEn : '');

    useEffect(() => {
        if (category) {
            setNameAr(category.categoryNameAr);
            setNameEn(category.categoryNameEn);
            setImageUrl(category.categoryImageUrl);
        }
    }, [category]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0])); // Preview image
        }
    };

    const handleUploadImage = async () => {
        if (!image) {
            toast.error('The image is required');
            return;
        }

        const formData = new FormData();
        formData.append('CategoryImage', image);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Category/UploadCategoryImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Image uploaded successfully!');
                setImageUrl(response.data.categoryImageUrl);
                console.log(response.data.categoryImageUrl)
            } else {
                toast.error('Failed to upload image: ' + response.data.message);
            }
        } catch (error: any) {
            toast.error('Error uploading image: ' + error.message);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nameAr || !nameEn) {
            toast.error('All fields are required');
            return;
        }

        if (!categoryImageUrl) {
            toast.error("You must upload an image");
            return;
        }

        const updatedCategory = {
            ...category,
             nameAr,
             nameEn,
            categoryImageUrl,
        };

        try {
            if (category) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Category/Update/${category.categoryId}`, updatedCategory, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                onUpdate(updatedCategory); // Just notify to refetch, don't directly update state here
                toast.success('Category updated successfully!');
            }
        } catch (error: any) {
            toast.error('Error updating category: ' + error.message);
        }
    };

    return (
        <div className={`w-[70vw] md:w-[30vw] lg:w-[50vw] bg-white rounded p-5 shadow-md transition-transform`}>
            <div className='flex justify-center'>
                <h2 className="text-2xl font-bold mb-4 text-center">{category ? "Update Category" : "Add Category"}</h2>
            </div>
            <form className="flex flex-col gap-5 justify-center" onSubmit={handleFormSubmit}>
                <Input type="file" name="category-image" label="Upload Image" accept="image/*" handleOnChange={handleImageChange} />
                <button type="button" className="rounded w-60 px-4 py-2 bg-green-500 hover:bg-green-600 font-bold text-white" onClick={handleUploadImage}>Upload Image</button>
                {categoryImageUrl && <img src={`${import.meta.env.VITE_BASE_URL}/${category.categoryImageUrl}`} alt="Category" className="h-16 w-16 object-cover" />} {/* Display image preview */}
                <Input type="text" name="nameAr" label="Name in Arabic" value={nameAr} handleOnChange={(e) => setNameAr(e.target.value)} />
                <Input type="text" name="nameEn" label="Name in English" value={nameEn} handleOnChange={(e) => setNameEn(e.target.value)} />
                <div className="flex gap-4">
                    <button type="submit" className="rounded w-60 px-4 py-2 bg-green-500 hover:bg-green-600 font-bold text-white">{category ? "Update Category" : "Add Category"}</button>
                    <button type="button" className="rounded w-60 px-4 py-2 bg-red-500 hover:bg-red-600 font-bold text-white" onClick={onCancel}>Cancel</button> {/* Cancel button */}
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
