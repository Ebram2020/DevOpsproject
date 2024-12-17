import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryForm from './edit-catogery';
import toast from 'react-hot-toast';

const ViewCategories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Category`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Category/Delete/${id}`);
            setCategories(categories.filter(category => category.categoryId !== id));
        } catch (error: any) {
            toast.error('Error deleting category: ' + error.message);
        }
    };

    const handleUpdate = async () => {
        try {
            await fetchCategories(); // Refetch categories after update
        } catch (error:any) {
            toast.error('Error updating category: ' + error.message);
        }
        setEditingCategory(null);
    };

    const handleCancel = () => {
        setEditingCategory(null);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="bg-white p-5 w-[70vw]">
                {editingCategory ? (
                    <CategoryForm 
                        category={editingCategory} 
                        onUpdate={handleUpdate} 
                        onCancel={handleCancel} 
                    />
                ) : (
                    <div>
                        <div className='flex justify-center'>
                            <h2 className="text-2xl font-bold mb-4 text-center">Categories</h2>
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-1">Arabic Name</th>
                                        <th className="px-4 py-1">English Name</th>
                                        <th className="px-4 py-1">Image</th>
                                        <th className="px-4 py-1">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(category => (
                                        <tr key={category.categoryId}>
                                            <td className="border px-4 py-1">{category.categoryNameAr}</td>
                                            <td className="border px-4 py-1">{category.categoryNameEn}</td>
                                            <td className="border px-4 py-1">
                                                <img src={`${import.meta.env.VITE_BASE_URL}/${category.categoryImageUrl}`} alt={category.categoryNameEn} className="h-16 w-16 object-cover" />
                                            </td>
                                            <td className="border px-4 py-2 flex gap-2">
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                                    onClick={() => deleteCategory(category.categoryId)}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                                    onClick={() => setEditingCategory(category)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewCategories;
