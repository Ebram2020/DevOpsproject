import React, { useContext } from "react";
import OwnerRow from "../table/row.comp";
import TableHead from "../table/head.comp";
import { OwnersContext } from "../../context/ownersContext";

const OwnerView: React.FC = () => {
  const { latestTenOwners } = useContext(OwnersContext);

  const viewHandle = () => {
    console.log("Display owner details");
  };

  if (!Array.isArray(latestTenOwners)) {
    // Handle case when latestTenOwners isn't an array (e.g., loading or error state)
    return <div>Loading...</div>; // You can adjust this based on your context
  }

  const viewProofIdentifier = (url: string) => {
    const baseUrl = import.meta.env.VITE_BASE_URL; // Your server base URL
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="container mx-auto bg-white rounded py-3">
      <div className="overflow-x-auto">
        <h2 className="font-bold text-slate-400 p-3">Latest 10 Owners</h2>
        <table className="table-auto min-w-full">
          <TableHead
            label1="Name"
            label2="Email"
            label3="Proof of Identity"
            label7="Actions"
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {latestTenOwners.map((owner) => (
              <OwnerRow
                key={owner.ownerId}
                id={owner.ownerId}
                label1={owner.userName}
                label2={owner.email}
                label3={owner.proofOfIdentityUrl}
                view={viewHandle}
                viewProofIdentifier={owner.proofOfIdentityUrl ? () => viewProofIdentifier(owner.proofOfIdentityUrl!) : undefined}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerView;
