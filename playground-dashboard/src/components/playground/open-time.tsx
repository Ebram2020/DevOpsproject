
import { Time } from "../../types/playground.types";

interface OpenTimeProps {
    time:Time[];
}

const OpenTime: React.FC<OpenTimeProps> = ({time})=>{

    const getDayName = (dayOfWeek: number): string =>{
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    }
    
    return (
         <div className="mb-4">
         <h2 className="text-xl font-semibold text-gray-800 mb-2">Open Times:</h2>
         <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                     <tr>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Day
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Start Time
                         </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             End Time
                         </th>
                     </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                     {time.map((time: Time) => (
                         <tr key={time.openTimeId}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getDayName(time.dayOfWeek)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{time.startTime}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{time.endTime}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
     </div>

    )
}

export default OpenTime;