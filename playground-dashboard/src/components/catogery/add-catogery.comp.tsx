import React from "react";
import plusIcon from "../../assets/plus.png";
import CatogeryForm from "./catogery-form.comp";


const AddCatoggery: React.FC = () => {

    return (
        <div>
            <div className="flex items-center cursor-pointer">
                <img className="w-5 h-5" src={plusIcon} alt="plus-icon" />
                <button className="px-4 py-3 font-bold text-slate-500">Add catogery</button>
            </div>
             <CatogeryForm/>
              
        </div>
    )
}


export default AddCatoggery;