import React from "react";

interface TableHeadProps {
    label1?: string
    label2?: string,
    label3?: string,
    label4?: string,
    label5?: string,
    label6?: string,
    label7?: string,
    label8?: string
}

const TableHead:React.FC<TableHeadProps>= (props) => {

    return (
        <thead>
            <tr className="text-gray-400 text-left border-b border-gray-400">
                <th className="px-4 py-2">{props.label1}</th>
                <th className="px-4 py-2">{props.label2}</th>
                <th className="px-4 py-2">{props.label3}</th>
                <th className="px-4 py-2">{props.label4}</th>
                <th className="px-4 py-2">{props.label5}</th>
                <th className="px-4 py-2">{props.label6}</th>
                <th className="px-4 py-2">{props.label7}</th>
            </tr>
        </thead>
    )
}

export default TableHead;