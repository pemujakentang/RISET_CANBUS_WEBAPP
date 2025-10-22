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
import { getLatestData, subscribeToData } from "@/lib/mqtt";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

type HistoryEntry = {
  date: string;
  avg: number;
  peak: number;
};

export default function AirIntakeTempPage() {
  const [currentTemp, setCurrentTemp] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [todayAvg, setTodayAvg] = useState(0);
  const [todayPeak, setTodayPeak] = useState(0);

  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([
    { date: "2025-10-05", avg: 44, peak: 52 },
    { date: "2025-10-06", avg: 46, peak: 53 },
    { date: "2025-10-07", avg: 45, peak: 51 },
    { date: "2025-10-08", avg: 47, peak: 54 },
  ]);

  useEffect(() => {
    // Get initial data
    const initial = getLatestData();
    if (initial?.airIntakeTemp !== undefined) {
      setCurrentTemp(initial.airIntakeTemp);
      setDataPoints([initial.airIntakeTemp]);
      setTimestamps([new Date().toLocaleTimeString("en-GB", { hour12: false })]);
    }

    // Subscribe to live MQTT updates
    const unsubscribe = subscribeToData((mqttData) => {
      if (mqttData.airIntakeTemp !== undefined) {
        const newVal = mqttData.airIntakeTemp;
        const now = new Date().toLocaleTimeString("en-GB", { hour12: false });

        setCurrentTemp(newVal);
        setDataPoints((prev) => [...prev.slice(-49), newVal]);
        setTimestamps((prev) => [...prev.slice(-49), now]);

        const all = [...dataPoints, newVal];
        const avg = all.reduce((a, b) => a + b, 0) / all.length;
        const peak = Math.max(...all);
        setTodayAvg(avg);
        setTodayPeak(peak);
      }
    });

    return unsubscribe;
  }, [dataPoints]);

  const lineData = {
    labels: timestamps,
    datasets: [
      {
        label: "Air Intake Temperature (°C)",
        data: dataPoints,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.3)",
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
      y: { beginAtZero: false },
      x: { ticks: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Air Intake Temperature</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 text-center w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Current Temperature</h2>
        <p className="text-6xl font-bold text-yellow-600">{currentTemp.toFixed(1)}°C</p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl mb-8">
        <h2 className="text-lg font-semibold mb-3">Temperature Over Time</h2>
        <Line ref={chartRef} data={lineData} options={options} />
      </div>

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
