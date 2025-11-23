"use client";

import { useEffect, useState } from "react";
import { getOdometerHistory } from "@/lib/api";
import TelemetryChart from "./TelemetryChart";

type OdometerRecord = {
    timestamp: string;
    odo: number;
};

export default function OdometerHistory({ vehicleId }: { vehicleId: string }) {
    const [range, setRange] = useState("1h");
    const [data, setData] = useState<{ t: number; value: number }[]>([]);

    useEffect(() => {
        async function load() {
            const result: OdometerRecord[] = await getOdometerHistory(vehicleId, range);

            setData(
                result.map((d: OdometerRecord) => ({
                    t: new Date(d.timestamp).getTime(),
                    value: d.odo,
                }))
            );
        }
        load();
    }, [vehicleId, range]);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-2">Odometer History</h2>

            <div className="flex gap-2 mb-4">
                {["10m", "1h", "6h", "24h"].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-3 py-1 rounded ${range === r ? "bg-green-500" : "bg-gray-700"
                            }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <TelemetryChart data={data} metric="odometer" />
        </div>
    );
}
