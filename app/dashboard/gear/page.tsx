"use client";

import { useEffect, useRef, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import type { Chart, ChartOptions } from "chart.js";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Gear labels
const GEAR_LABELS = ["P", "R", "N", "D", "L"];

// Dummy historical data
const dummyHistory = [
    { date: "2025-10-07", P: 3600, R: 420, N: 180, D: 7200, L: 0 },
    { date: "2025-10-08", P: 4000, R: 600, N: 300, D: 6500, L: 100 },
    { date: "2025-10-09", P: 3700, R: 500, N: 240, D: 7000, L: 0 },
];

export default function GearDetail() {
    const [gear, setGear] = useState("P");
    const [timestamps, setTimestamps] = useState<string[]>([]);
    const [gearValues, setGearValues] = useState<number[]>([]);
    const chartRef = useRef<Chart<"line"> | null>(null);

    // Simulate live gear updates
    useEffect(() => {
        const interval = setInterval(() => {
            const newGear = GEAR_LABELS[Math.floor(Math.random() * GEAR_LABELS.length)];
            const now = new Date().toLocaleTimeString();

            setGear(newGear);
            setTimestamps((prev) => [...prev.slice(-19), now]);
            setGearValues((prev) => [...prev.slice(-19), GEAR_LABELS.indexOf(newGear)]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Gear over time graph
    const lineData = {
        labels: timestamps,
        datasets: [
            {
                label: "Gear Position",
                data: gearValues,
                borderColor: "#7c3aed",
                backgroundColor: "rgba(124, 58, 237, 0.3)",
                fill: true,
                stepped: true,
                tension: 0, // digital step-like movement
            },
        ],
    };

    const lineOptions: ChartOptions<"line"> = {
        responsive: true,
        animation: { duration: 0 },
        scales: {
            y: {
                ticks: {
                    // callback signature compatible with chart.js v4 typings:
                    // (this: Scale, tickValue: string | number, index: number, ticks: Tick[]) => ...
                    callback: function (
                        this: unknown,
                        tickValue: string | number,
                        _index: number,
                        _ticks: unknown[]
                    ): string | number {
                        // tickValue can be string or number — coerce to number safely
                        const n = typeof tickValue === "string" ? Number(tickValue) : tickValue;
                        const idx = Number(n);
                        return Number.isFinite(idx) ? GEAR_LABELS[idx] ?? "" : "";
                    },
                    stepSize: 1,
                },
                min: 0,
                max: 4,
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    // Cumulative gear times (dummy in seconds)
    const totalTimes = { P: 11300, R: 1520, N: 720, D: 20700, L: 100 };

    const totalBarData = {
        labels: GEAR_LABELS,
        datasets: [
            {
                label: "Total Time (seconds)",
                data: GEAR_LABELS.map((g) => totalTimes[g as keyof typeof totalTimes]),
                backgroundColor: "#4f46e5",
            },
        ],
    };

    const dailyBarData = {
        labels: dummyHistory.map((d) => d.date),
        datasets: GEAR_LABELS.map((gearLabel, idx) => ({
            label: gearLabel,
            data: dummyHistory.map((d) => d[gearLabel as keyof typeof d]),
            backgroundColor: [
                "#4f46e5",
                "#16a34a",
                "#f97316",
                "#06b6d4",
                "#dc2626",
            ][idx],
        })),
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">
                Gear Position Detail
            </h1>

            {/* Current Gear Display */}
            <div className="bg-white shadow-lg rounded-2xl p-10 text-center mb-10">
                <h2 className="text-2xl text-gray-600">Current Gear</h2>
                <p className="text-8xl font-bold text-indigo-600 mt-4 transition-all duration-300">
                    {gear}
                </p>
            </div>

            {/* Live Graph */}
            <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Gear Movement (Live)
                </h2>
                <Line ref={chartRef} data={lineData} options={lineOptions} />
            </div>

            {/* Total Gear Time */}
            <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Total Time in Each Gear
                </h2>
                <Bar data={totalBarData} options={{ responsive: true }} />
            </div>

            {/* Daily Gear Time Breakdown */}
            <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Daily Gear Usage (Seconds)
                </h2>
                <Bar data={dailyBarData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
            </div>
        </div>
    );
}
