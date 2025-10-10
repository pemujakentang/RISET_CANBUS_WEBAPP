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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

type HistoryEntry = {
  date: string;
  avg: number;
  peak: number;
};

export default function WaterTempPage() {
  const [currentTemp, setCurrentTemp] = useState(85); // °C
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [todayAvg, setTodayAvg] = useState(0);
  const [todayPeak, setTodayPeak] = useState(0);

  const chartRef = useRef<ChartJS<"line"> | null>(null);

  // dummy historical data
  const [history, setHistory] = useState<HistoryEntry[]>([
    { date: "2025-10-05", avg: 84, peak: 93 },
    { date: "2025-10-06", avg: 85, peak: 95 },
    { date: "2025-10-07", avg: 86, peak: 97 },
    { date: "2025-10-08", avg: 83, peak: 92 },
  ]);

  // simulate live updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => {
        const newVal = Math.max(70, Math.min(100, prev + (Math.random() * 4 - 2)));
        const t = new Date().toLocaleTimeString("en-GB", { hour12: false });
        setDataPoints((d) => [...d.slice(-49), newVal]);
        setTimestamps((tms) => [...tms.slice(-49), t]);

        // compute new daily stats
        const all = [...dataPoints, newVal];
        const avg = all.reduce((a, b) => a + b, 0) / all.length;
        const peak = Math.max(...all);
        setTodayAvg(avg);
        setTodayPeak(peak);
        return newVal;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dataPoints]);

  const lineData = {
    labels: timestamps,
    datasets: [
      {
        label: "Water Temperature (°C)",
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
      y: { beginAtZero: false, min: 60, max: 110 },
      x: { ticks: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Water Temperature</h1>

      {/* Current Temperature */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 text-center w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Current Temperature</h2>
        <p className="text-6xl font-bold text-blue-600">{currentTemp.toFixed(1)}°C</p>
      </div>

      {/* Live Graph */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl mb-8">
        <h2 className="text-lg font-semibold mb-3">Temperature Over Time</h2>
        <Line ref={chartRef} data={lineData} options={options} />
      </div>

      {/* Today Stats */}
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
