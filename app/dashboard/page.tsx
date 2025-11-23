"use client";

import { useEffect, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import { getLatestData, subscribeToData } from "@/lib/mqtt";
import { GearPosition } from "@/lib/enums/gear";
import VerticalBar from "../components/VerticalBar";
import HorizontalBar from "../components/HorizontalBar";

export default function Dashboard() {
    const [data, setData] = useState({
        rpm: 2500,
        speed: 0,
        throttle: 90,
        gear: 0,
        brake: 50.54,
        engineCoolantTemp: 0,
        airIntakeTemp: 0,
        odoMeter: 0,
    });

    useEffect(() => {
        // Get initial data
        const initialData = getLatestData();
        setData(prevData => ({
            ...prevData,
            ...initialData
        }));

        // setData(initialData);

        // Subscribe to real-time updates
        const unsubscribe = subscribeToData((mqttData) => {
            setData(prevData => ({
                ...prevData,
                ...mqttData
            }));
        });

        return unsubscribe;
    }, []);

    function getGearLabel(gearValue: number): string {
        switch (gearValue) {
            case GearPosition.P:
                return "P";
            case GearPosition.R:
                return "R";
            case GearPosition.N:
                return "N";
            case GearPosition.D:
                return "D";
            case GearPosition.S:
                return "S";
            case GearPosition.L:
                return "L";
            case GearPosition.T:
                return "T";
            default:
                return "Unknown";
        }
    }


    return (
        <div className="h-screen bg-gray-800">
            <div className="flex justify-center p-10 w-full h-[60%] flex-wrap font-7segment">
                <h1 className="text-4xl font-bold mb-8 w-full text-center font-7segment text-white">Vehicle Dashboard</h1>
                <div className="w-full h-full flex justify-center gap-6">
                    <VerticalBar name="Throttle" value={data.throttle} color="#00A551" width={80} />

                    <div className="w-full flex justify-center flex-wrap gap-6 ">
                        <div className="w-full flex justify-center">
                            <HorizontalBar name="RPM" max={5000} value={data.rpm} />
                        </div>
                        
                        <div className="flex justify-center flex-wrap gap-6 w-full">
                            <ParameterCard name="Odometer" value={data.odoMeter} unit="km" link="/dashboard/odometer" />
                            <ParameterCard name="Speed" value={data.speed} unit="km/h" link="/dashboard/speed" />
                            <ParameterCard name="Gear" value={getGearLabel(data.gear)} link="/dashboard/gear" />


                            <ParameterCard name="Engine Coolant Temp" value={data.engineCoolantTemp} unit="°C" link="/dashboard/engine-coolant-temp" />
                            <ParameterCard name="Intake Temp" value={data.airIntakeTemp} unit="°C" link="/dashboard/air-intake-temp" />
                        </div>
                    </div>

                    <VerticalBar name="Brake" value={data.brake} color="#EF1A2D" width={80} />
                </div>
            </div>
        </div>
    );
}
