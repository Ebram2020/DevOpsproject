import React from "react";
import avatarIcon from "../../assets/avatar.png";

interface BasicInfoProps {
    username: string;
    email: string;
    avatar: string | null; // Allow avatar to be null
    proofOfIdentityUrl: string | null; // Add proofOfIdentityUrl as a prop
}

const OwnerBasicInfo: React.FC<BasicInfoProps> = ({ username, email, avatar, proofOfIdentityUrl }) => {
    // Fallback to default avatar if the provided avatar URL is null or empty
    const profilePictureUrl = avatar ? `${import.meta.env.VITE_BASE_URL}/${avatar}` : avatarIcon;

    return (
        <div className="flex flex-col gap-5 p-5 bg-white rounded">
            <h2 className="font-bold text-2xl border-b border-slate-400 pb-3">Basic Info</h2>
            <div className="flex justify-around items-center flex-wrap gap-5">
                <div className="flex flex-col items-center">
                    <img className="w-20 h-20 rounded-full" src={profilePictureUrl} alt="avatar-image" />
                    <h2 className="font-bold text-xl">{username}</h2>
                </div>
                <div>
                    <p className="font-bold text-xl">
                        Email: <span className="text-sm text-slate-500">{email}</span>
                    </p>
                </div>
            </div>
            {proofOfIdentityUrl && (
                <div className="mt-5">
                    <a href={`${import.meta.env.VITE_BASE_URL}/${proofOfIdentityUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Proof of Identity
                    </a>
                </div>
            )}
        </div>
    );
};

export default OwnerBasicInfo;