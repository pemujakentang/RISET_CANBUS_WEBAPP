"use client";

import { useEffect, useState } from "react";
import { getTelemetryRange, TelemetryKey } from "@/lib/telemetryBuffer";
import TelemetryChart from "./TelemetryChart";

type TelemetryPoint = {
    t: number;
    value: number;
};

const ranges = [
    { label: "10s", value: 10 },  // 10 seconds
    { label: "30s", value: 30 },  // 30 seconds
    { label: "60s", value: 60 },  // 1 minute
    { label: "10m", value: 600 }, // 10 minutes (10 * 60)
    { label: "30m", value: 1800 }, // 30 minutes (30 * 60)
    { label: "1h", value: 3600 },  // 1 hour (60 * 60)
];

export default function MetricChart({ metric }: { metric: TelemetryKey }) {
    const [range, setRange] = useState<number>(30);
    const [data, setData] = useState<TelemetryPoint[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const result = getTelemetryRange(metric, range);
            setData(result);
        }, 300);

        return () => clearInterval(timer);
    }, [metric, range]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 capitalize text-white">
                {metric} History
            </h2>

            <div className="flex gap-3 mb-4">
                {ranges.map((r) => (
                    <button
                        key={r.value}
                        onClick={() => setRange(r.value)}
                        className={`px-4 py-2 rounded-md ${range === r.value
                                ? "bg-green-500 text-black"
                                : "bg-gray-700 text-white"
                            }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            <TelemetryChart data={data} metric={metric} />
        </div>
    );
}
