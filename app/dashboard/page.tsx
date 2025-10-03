export default function Dashboard() {
    const data = {
        rpm: 3200,
        speed: 72,
        throttle: 40,
        gear: 3,
        brakePressure: 12.5, // bar (example)
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8">Vehicle Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">RPM (0x1DC)</h2>
                    <p className="text-3xl font-bold text-blue-600">{data.rpm}</p>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Speed (0x158)</h2>
                    <p className="text-3xl font-bold text-green-600">{data.speed} km/h</p>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Throttle Position (0x17C)</h2>
                    <p className="text-3xl font-bold text-orange-600">{data.throttle}%</p>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Gear Position (0x191)</h2>
                    <p className="text-3xl font-bold text-purple-600">{data.gear}</p>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold">Brake Pressure (0x1A4)</h2>
                    <p className="text-3xl font-bold text-red-600">{data.brakePressure} bar</p>
                </div>
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
