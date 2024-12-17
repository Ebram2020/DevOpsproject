import React from 'react';
import { Link } from 'react-router-dom';

interface OwnerProps {
  label1?: string | number;
  label2?: string | number;
  label3?: string; // Ensure label3 is specifically a string
  label4?: string | React.ReactNode;
  label5?: number | string;
  label6?: any;
  label7?: string;
  id: string;
  activate?: () => void;
  unActivate?: () => void;
  delete?: () => void;
  view?: () => void;
  viewProofIdentifier?: (url: string) => void;
}

const OwnerRow: React.FC<OwnerProps> = ({
  label1,
  label2,
  label3,
  label4,
  label5,
  label6,
  label7,
  id,
  activate,
  unActivate,
  delete: deleteOwner,
  view,
  viewProofIdentifier,
}) => {
  const handleViewProofClick = () => {
    if (viewProofIdentifier && label3) {
      viewProofIdentifier(label3);
    }
  };

  const handleDelete = () => {
    if (deleteOwner) {
      deleteOwner();
    }
  };

  return (
    <tr>
      <td className="px-4 py-2">{label1}</td>
      <td className="px-4 py-2">{label2}</td>
      <td className="px-4 py-2">
        {label3 && (
          <a href="#" onClick={handleViewProofClick} className="text-blue-500 hover:underline">
            View Proof
          </a>
        )}
        {label7 && !label3 && (
          <p>{label7}</p>
        )}
      </td>
      <td className="px-4 py-2">{label4}</td>
      <td className="px-4 py-2">{label5}</td>
      <td className="px-4 py-2">{label6}</td>
      <td className="px-4 py-2 flex gap-2">
        {activate && (
          <button
            onClick={activate}
            className="hover:bg-blue-600 bg-blue-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
          >
            Activate
          </button>
        )}
        {unActivate && (
          <button
            onClick={unActivate}
            className="hover:bg-red-600 bg-red-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
          >
            UnActivate
          </button>
        )}
        {deleteOwner && (
          <button
            onClick={handleDelete}
            className="hover:bg-red-600 bg-red-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
          >
            Delete
          </button>
        )}
        {view && (
          <Link to={`/owner/${id}`}>
            <button
              onClick={view}
              className="hover:bg-green-600 bg-green-500 text-white font-bold cursor-pointer px-3 py-2 rounded"
            >
              {label7 ? label7 : 'View'}
            </button>
          </Link>
        )}
      </td>
    </tr>
  );
};

export default OwnerRow;
