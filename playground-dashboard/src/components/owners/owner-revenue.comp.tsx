import React from "react";
import RevenueChart from "../charts/revenue-charts.comp";



const OwnerRevenue: React.FC = ()=>{


    return (
        <div className="font-bold bg-white rounded shadow-lg p-5 flex flex-col gap-10">
        <h2 className="text-2xl border-b border-slate-300 pb-3">Revenue</h2>
        <div className="font-bold flex items-center gap-5">
            <p className="text-xl">Revenue Upto Day : </p>
            <span className="text-slate-400">1000$</span>
        </div>

        <div className="flex justify-center items-center">
            <RevenueChart/>
        </div>

    </div>
    )
}

export default OwnerRevenue;