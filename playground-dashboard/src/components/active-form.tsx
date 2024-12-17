import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (supplierCode: string) => void;
}

const ActiveForm: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [supplierCode, setSupplierCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(supplierCode);
        setSupplierCode('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded">
                <h2 className="text-xl mb-4">Enter Supplier Code</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={supplierCode}
                        onChange={(e) => setSupplierCode(e.target.value)}
                        className="border p-2 mb-4 w-full"
                        placeholder="Supplier Code"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActiveForm;
