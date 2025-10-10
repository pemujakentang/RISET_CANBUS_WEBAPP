"use client";

import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions, Chart } from "chart.js";
import { getLatestData, subscribeToData } from "@/lib/mqtt";

import "chart.js/auto";

interface ParameterDetailProps {
    name: string;
    unit: string;
    color: string;
    parameterKey?: "rpm" | "speed" | "throttle" | "gear" | "brakePressure" | "waterTemp" | "oilTemp";
}

export default function ParameterDetail({ name, unit, color, parameterKey = "rpm" }: ParameterDetailProps) {
    const [value, setValue] = useState(0);
    const [dataPoints, setDataPoints] = useState<number[]>([]);
    const [timestamps, setTimestamps] = useState<string[]>([]);
    const chartRef = useRef<Chart<"line">>(null);

    // Use real MQTT data instead of random simulation
    useEffect(() => {
        // Get initial data
        const initialData = getLatestData();
        if (initialData[parameterKey] !== undefined) {
            setValue(initialData[parameterKey]!);
        }

        // Subscribe to real-time MQTT updates
        const unsubscribe = subscribeToData((mqttData) => {
            if (mqttData[parameterKey] !== undefined) {
                const newValue = mqttData[parameterKey]!;
                setValue(newValue);

                setDataPoints((prev) => {
                    const updated = [...prev, newValue];
                    return updated.length > 20 ? updated.slice(1) : updated;
                });

                setTimestamps((prev) => {
                    const updated = [...prev, new Date().toLocaleTimeString()];
                    return updated.length > 20 ? updated.slice(1) : updated;
                });
            }
        });

        return unsubscribe;
    }, [parameterKey]);

    // dummy historical data
    const history = [
        { date: "2025-10-05", avg: 45 },
        { date: "2025-10-06", avg: 50 },
        { date: "2025-10-07", avg: 60 },
    ];

    const chartData = {
        labels: timestamps,
        datasets: [
            {
                label: `${name} (${unit})`,
                data: dataPoints,
                borderColor: color,
                backgroundColor: color + "40",
                tension: 0.3,
                fill: true,
                pointRadius: 0,
            },
        ],
    };

    const chartOptions: ChartOptions<"line"> = {
        animation: {
            duration: 0, // ✅ disables morphing safely
        },
        scales: {
            x: {
                ticks: { display: true },
            },
            y: {
                beginAtZero: true,
            },
        },
        elements: {
            line: { tension: 0.3 },
        },
        plugins: {
            legend: { display: false },
        },
    };


    return (
        <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2">{name} Details</h1>
            <p className="text-lg mb-6">
                Current Value:{" "}
                <span className="font-semibold text-blue-700">
                    {value} {unit}
                </span>
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl mb-8">
                <h2 className="text-lg font-semibold mb-3">Live Graph</h2>
                <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl">
                <h2 className="text-lg font-semibold mb-3">Historical Data</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">
                                Average {name} ({unit})
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row) => (
                            <tr key={row.date} className="border-t">
                                <td className="p-2">{row.date}</td>
                                <td className="p-2">{row.avg}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
