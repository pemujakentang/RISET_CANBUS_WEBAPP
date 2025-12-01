import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Time series adapter

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

type TelemetryPoint = {
    t: number;
    value: number;
};

type TelemetryChartProps = {
    data: TelemetryPoint[];
    metric: string;
};

export default function TelemetryChart({ data, metric }: TelemetryChartProps) {

    const chartData = data.map(d => ({
        x: d.t,
        y: d.value,
    }));

    const chartDataObject = {
        datasets: [
            {
                label: metric.charAt(0).toUpperCase() + metric.slice(1),
                data: chartData,
                borderColor: '#00ff66',
                backgroundColor: 'rgba(0, 255, 102, 0.1)',
                pointRadius: 0,
                pointHitRadius: 2,
                tension: 0.2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'second' as const,
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                    },
                },
                ticks: { color: '#000' },
                title: { display: true, text: 'Time (Live)', color: '#000' },
                grid: { color: 'rgba(0, 0, 0, 0.2)' }
            },
            y: {
                ticks: { color: '#000' },
                title: { display: true, text: metric.toUpperCase(), color: '#000' },
                grid: { color: 'rgba(0, 0, 0, 0.2)' },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { display: false },
            title: { display: false, text: `${metric.toUpperCase()} History`, color: '#000' }
        }
    };

    return (
        <div className="w-full h-[300px] bg-[#e6e6e6] p-4 rounded-xl shadow-md text-black relative"
            style={{
                boxShadow:
                    "inset 0 0 10px #969696, 0 0 10px rgba(255,255,255,0.2)",
            }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundSize: "10px 10px",
                    backgroundImage:
                        "linear-gradient(#00000020 1px, transparent 1px), linear-gradient(90deg, #00000020 1px, transparent 1px)",
                }}
            />
            <Line data={chartDataObject} options={options} />
        </div>
    );
}