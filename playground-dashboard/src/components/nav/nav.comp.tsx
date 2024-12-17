import React from "react";
import { useAdmin } from "../../context/adminContext";

const Nav: React.FC = () => {
    const { admin } = useAdmin()
    return (
        <div className="flex items-center justify-end w-full mt-5 pr-5 cursor-pointer">
            <div className="flex justify-end font-bold text-2xl items-center">
                <span>{admin?.username}</span>
            </div>
        </div>
    )
}

export default Nav;
