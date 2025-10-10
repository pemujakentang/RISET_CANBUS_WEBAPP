"use client";

import { useEffect, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import { getLatestData, subscribeToData } from "@/lib/mqtt";

export default function Dashboard() {
    const [data, setData] = useState({
        rpm: 0,
        speed: 0,
        throttle: 0,
        gear: 0,
        brakePressure: 0,
        waterTemp: 0,
        oilTemp: 0,
    });

    useEffect(() => {
        // Get initial data
        const initialData = getLatestData();
        setData(prevData => ({
            ...prevData,
            ...initialData
        }));

        // Subscribe to real-time updates
        const unsubscribe = subscribeToData((mqttData) => {
            setData(prevData => ({
                ...prevData,
                ...mqttData
            }));
        });

        return unsubscribe;
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold mb-8">Vehicle Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                <ParameterCard name="RPM (0x1DC)" value={data.rpm} color="text-blue-600" link="/dashboard/rpm" />
                <ParameterCard name="Speed (0x158)" value={data.speed} unit="km/h" color="text-green-600" link="/dashboard/speed" />
                <ParameterCard name="Throttle (0x17C)" value={data.throttle} unit="%" color="text-orange-600" link="/dashboard/throttle" />
                <ParameterCard name="Gear (0x191)" value={data.gear} color="text-purple-600" link="/dashboard/gear" />
                <ParameterCard name="Brake Pressure (0x1A4)" value={data.brakePressure} unit="bar" color="text-red-600" link="/dashboard/brake" />
                <ParameterCard name="Water Temp" value={data.waterTemp} unit="°C" color="text-cyan-400" link="/dashboard/water-temp" />
                <ParameterCard name="Oil Temp" value={data.oilTemp} unit="°C" color="text-yellow-400" link="/dashboard/oil-temp" />
            </div>
        </div>
    );
}

// import { useEffect, useState } from "react";

// export default function Dashboard() {
//     const [data, setData] = useState({
//         rpm: 0,
//         speed: 0,
//         throttle: 0,
//         gear: 0,
//     });

//     useEffect(() => {
//         const interval = setInterval(async () => {
//             try {
//                 const res = await fetch("/api/vehicle");
//                 const json = await res.json();
//                 setData(json);
//             } catch (err) {
//                 console.error("Error fetching data", err);
//             }
//         }, 1000); // poll every second

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div>
//             <h1>Vehicle Dashboard</h1>
//             <p><b>RPM:</b> {data.rpm}</p>
//             <p><b>Speed:</b> {data.speed} km/h</p>
//             <p><b>Throttle:</b> {data.throttle}%</p>
//             <p><b>Gear:</b> {data.gear}</p>
//         </div>
//     );
// }
