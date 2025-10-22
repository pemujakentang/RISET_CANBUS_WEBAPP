"use client";

import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { getLatestData, subscribeToData } from "@/lib/mqtt"; // ✅ use same live data utils

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

type HistoryEntry = {
  date: string;
  avg: number;
  peak: number;
};

export default function EngineCoolantTempPage() {
  const [currentTemp, setCurrentTemp] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [todayAvg, setTodayAvg] = useState(0);
  const [todayPeak, setTodayPeak] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([
    { date: "2025-10-05", avg: 88, peak: 96 },
    { date: "2025-10-06", avg: 90, peak: 99 },
    { date: "2025-10-07", avg: 91, peak: 100 },
    { date: "2025-10-08", avg: 89, peak: 97 },
  ]);

  const chartRef = useRef<ChartJS<"line"> | null>(null);

  // ✅ Subscribe to MQTT data
  useEffect(() => {
    // Load last known data if any
    const latest = getLatestData();
    if (latest?.engineCoolantTemp !== undefined) {
      const now = new Date().toLocaleTimeString("en-GB", { hour12: false });
      const temp = Number(latest.engineCoolantTemp);
      setCurrentTemp(temp);
      setDataPoints((prev) => [...prev.slice(-49), temp]);
      setTimestamps((prev) => [...prev.slice(-49), now]);
    }

    // Live subscription
    const unsubscribe = subscribeToData((mqttData) => {
      if (mqttData.engineCoolantTemp !== undefined) {
        const temp = Number(mqttData.engineCoolantTemp);
        const now = new Date().toLocaleTimeString("en-GB", { hour12: false });

        setCurrentTemp(temp);
        setDataPoints((prev) => {
          const updated = [...prev.slice(-49), temp];
          const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
          const peak = Math.max(...updated);
          setTodayAvg(avg);
          setTodayPeak(peak);
          return updated;
        });
        setTimestamps((prev) => [...prev.slice(-49), now]);
      }
    });

    return unsubscribe;
  }, []);

  const lineData = {
    labels: timestamps,
    datasets: [
      {
        label: "Engine Coolant Temperature (°C)",
        data: dataPoints,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        tension: 0.3,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    animation: false,
    scales: {
      y: { beginAtZero: false, min: 60, max: 120 },
      x: { ticks: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Engine Coolant Temperature</h1>

      {/* Current Temperature */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 text-center w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Current Temperature</h2>
        <p className="text-6xl font-bold text-blue-600">{currentTemp.toFixed(1)}°C</p>
      </div>

      {/* Live Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl mb-8">
        <h2 className="text-lg font-semibold mb-3">Temperature Over Time</h2>
        <Line ref={chartRef} data={lineData} options={options} />
      </div>

      {/* Stats (Avg & Peak) */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl mb-8">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Average Temp (Today)</h2>
          <p className="text-4xl font-bold text-indigo-600">{todayAvg.toFixed(1)}°C</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Peak Temp (Today)</h2>
          <p className="text-4xl font-bold text-red-600">{todayPeak.toFixed(1)}°C</p>
        </div>
      </div>

      {/* Historical Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Historical Data</h2>
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b bg-gray-200">
              <th className="p-2">Date</th>
              <th className="p-2">Average (°C)</th>
              <th className="p-2">Peak (°C)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row) => (
              <tr key={row.date} className="border-b hover:bg-gray-50">
                <td className="p-2">{row.date}</td>
                <td className="p-2">{row.avg}</td>
                <td className="p-2 text-red-500 font-semibold">{row.peak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
