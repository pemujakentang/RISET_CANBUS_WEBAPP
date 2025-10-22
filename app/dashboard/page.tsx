"use client";

import { useEffect, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import { getLatestData, subscribeToData } from "@/lib/mqtt";
import { GearPosition } from "@/lib/enums/gear";

export default function Dashboard() {
    const [data, setData] = useState({
        rpm: 0,
        speed: 0,
        throttle: 0,
        gear: 0,
        brake: 0,
        engineCoolantTemp: 0,
        airIntakeTemp: 0,
        maybeVoltage: 0,
        maybeOdo: 0,
        maybeOdo1: 0,
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold mb-8">Vehicle Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                <ParameterCard name="RPM (0x1DC)" value={data.rpm} color="text-blue-600" link="/dashboard/rpm" />
                <ParameterCard name="Speed (0x158)" value={data.speed} unit="km/h" color="text-green-600" link="/dashboard/speed" />
                <ParameterCard name="Throttle (0x17C)" value={data.throttle} unit="%" color="text-orange-600" link="/dashboard/throttle" />
                <ParameterCard name="Gear (0x191)" value={getGearLabel(data.gear)} color="text-purple-600" link="/dashboard/gear" />
                <ParameterCard name="Brake Pressure (0x1A4)" value={data.brake} unit="%" color="text-red-600" link="/dashboard/brake" />

                <ParameterCard name="Engine Coolant Temp" value={data.engineCoolantTemp} unit="°C" color="text-cyan-400" link="/dashboard/engine-coolant-temp" />
                <ParameterCard name="Intake Temp" value={data.airIntakeTemp} unit="°C" color="text-yellow-400" link="/dashboard/air-intake-temp" />

                <ParameterCard name="Battery Voltage?" value={data.maybeVoltage} unit="V" color="text-cyan-400" link="/dashboard/battery-voltage" />
                <ParameterCard name="Odometer?" value={data.maybeOdo} unit="km" color="text-yellow-400" link="/dashboard/odometer" />
                <ParameterCard name="Odometer? 2" value={data.maybeOdo1} unit="km" color="text-yellow-400" link="/dashboard/odometer-2" />
            </div>
        </div>
    );
}
