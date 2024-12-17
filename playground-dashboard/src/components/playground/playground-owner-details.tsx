import React from "react";


interface StadiumOwnerBsicInfoProps {
    address: string;
    location: string | null;
    pricePerHour: number;
    minHoursReservation: number;
    approvalStatus: number;
}

const StadiumOwnerDetails: React.FC<StadiumOwnerBsicInfoProps> = ({address, location, pricePerHour, minHoursReservation, approvalStatus})=>{
    return (
        <div className="w-full md:w-1/2 md:pl-4">
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">Address:</span> {address}
        </p>
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">Location:</span> {location ?? 'Not specified'}
        </p>
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">Price per Hour:</span> ${pricePerHour}
        </p>
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">Minimum Hours Reservation:</span> {minHoursReservation} hours
        </p>
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">Approval Status:</span> {approvalStatus === 1 ? 'Approved' : 'Pending'}
        </p>

    </div>
    )
}

export default StadiumOwnerDetails;