import React from "react";

interface InputProps {
    label: string,
    name: string,
    value?: string,
    error?: string, 
    type: string,
    isHidden?:string,
    accept?: string,
    bg?:string,
    px?: string,
    py?: string,
    rounded?: string,
    pointer?: string,
    font?: string,
    textCenter?:string,
    textColor?: string,
    handleOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleOnSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void
}


const Input: React.FC<InputProps>= (props) => {
    return (
        <div>
            <label className={`block text-slate-500 text-${props.textCenter} text-${props.textColor} ${props.bg} ${props.px} ${props.py} ${props.rounded} ${props.pointer} ${props.font}`} htmlFor={props.label}>{props.label}</label>
            <input
                type={props.type}
                placeholder={props.label}
                id={props.label}
                name={props.name}
                value={props.value}
                accept={props.accept}
                onSelect={props.handleOnSelect}
                onChange={props.handleOnChange} // Changed to props.handleOnChange
                className={` ${props.isHidden} w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
            />
            {props.error && <p className="text-red-500 text-xs mt-1">{props.error}</p>}
        </div>
    );
}

export default Input;
