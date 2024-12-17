import React from "react";

interface NumbersProps {
    title:string,
    number:number,
    sign?:string
}

const DisplayNumbers:React.FC<NumbersProps> = (props)=>{

    return (
        <div className="shadow-md p-2 w-[400px] h-[110px] rounded bg-white flex flex-col gap-5 font-bold">
             <h2 className="text-gray-400">{props.title}</h2>
             <span className="text-2xl">{props.sign}{props.number}</span>
        </div>
    )
}

export default DisplayNumbers;