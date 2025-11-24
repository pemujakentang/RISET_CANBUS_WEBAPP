import { useEffect, useState } from "react";
import { getOdometerHistory } from "@/lib/api";
import OdometerChart from "./OdometerChart";

type OdometerRecord = {
    odo: number;
    bucket: {
        $date: string;
    };
};

// ⭐️ DEFINE YOUR NEW TIME RANGE OPTIONS
const TIME_RANGES = ["1h", "24h", "7d", "30d", "1y", "ytd"];

export default function OdometerHistory({ vehicleId }: { vehicleId: string }) {
    const [range, setRange] = useState("1h");
    // State structure for Chart.js labels/datasets is simpler with the raw object array
    const [data, setData] = useState<OdometerRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                // The result is the array of { bucket, odo } objects
                const result: OdometerRecord[] = await getOdometerHistory(vehicleId, range);
                console.log("Fetched odometer data:", result);

                // ⭐️ FIX: No need to map to {t, value} format, Chart.js can use the raw objects
                // We ensure the timestamp is a Date object on the frontend for Chart.js's Time scale.
                // However, since Chart.js Adapter handles ISO strings, we can feed it directly.
                setData(result);
            } catch (err) {
                console.error(err);
                setError("Could not load odometer data.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [vehicleId, range]);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-2">Odometer History</h2>

            <div className="flex gap-2 mb-4">
                {TIME_RANGES.map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-3 py-1 rounded ${range === r ? "bg-green-500" : "bg-gray-700"}`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {loading && <p className="text-gray-400">Loading data...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}

            <OdometerChart data={data} metric="odometer" />
        </div>
    );
}