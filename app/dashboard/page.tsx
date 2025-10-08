import mqtt from "mqtt";
import ParameterCard from "../components/ParameterCard";

export default function Dashboard() {
    const data = {
        rpm: 3200,
        speed: 72,
        throttle: 40,
        gear: 3,
        brakePressure: 12.5, // bar (example)
    };

    const client = mqtt.connect("wss://36fb9291221e425d953221c0e7547685.s1.eu.hivemq.cloud:8884/mqtt", {
        username: "mpiskawe",
        password: "Mpiskawe123"
    });

    client.on("connect", () => {
    console.log("Connected!");
    client.subscribe("vehicle", (err) => {
        if (!err) {
        console.log("📡 Subscribed to vehicle");
        client.publish("vehicle", "Hello from Node.js via HiveMQ Cloud");
        } else {
        console.error("Subscribe error:", err);
        }
    });
    });


    client.on("message", (topic, message) => {
    console.log(message.toString());
    });
    client.on("error", (err) => {
        console.error("Connection error: ", err);
    });


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold mb-8">Vehicle Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                <ParameterCard name="RPM (0x1DC)" value={data.rpm} color="text-blue-600" link="/dashboard/rpm" />
                <ParameterCard name="Speed (0x158)" value={data.speed} unit="km/h" color="text-green-600" link="/dashboard/speed" />
                <ParameterCard name="Throttle (0x17C)" value={data.throttle} unit="%" color="text-orange-600" link="/dashboard/throttle" />
                <ParameterCard name="Gear (0x191)" value={data.gear} color="text-purple-600" link="/dashboard/gear" />
                <ParameterCard name="Brake Pressure (0x1A4)" value={data.brakePressure} unit="bar" color="text-red-600" link="/dashboard/brake" />
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
