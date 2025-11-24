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

// Register the necessary components for Chart.js
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
    // Note: 't' is milliseconds since epoch, coming from your telemetry buffer
    t: number;
    value: number;
};

type TelemetryChartProps = {
    data: TelemetryPoint[];
    metric: string;
};

export default function TelemetryChart({ data, metric }: TelemetryChartProps) {

    // Transform the data to the format Chart.js Time Scale expects: {x: timestamp, y: value}
    // We use the raw 't' (timestamp in ms) for the x-axis.
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
                pointHitRadius: 2, // For easier tooltip triggering
                tension: 0.2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            // Configure the Time Scale for the X-axis
            x: {
                type: 'time' as const,
                time: {
                    unit: 'second' as const, // Default to seconds for short ranges
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                    },
                },
                ticks: { color: '#aaa' },
                title: { display: true, text: 'Time (Live)', color: '#fff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            // Configure the Linear Scale for the Y-axis
            y: {
                ticks: { color: '#aaa' },
                title: { display: true, text: metric.toUpperCase(), color: '#fff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                // Optional: Force zero baseline for metrics like speed/throttle
                beginAtZero: true,
            },
        },
        plugins: {
            legend: { display: false },
            title: { display: true, text: `${metric.toUpperCase()} History`, color: '#fff' }
        }
    };

    return (
        <div className="w-full h-[300px] bg-black p-4 rounded-xl shadow-md">
            <Line data={chartDataObject} options={options} />
        </div>
    );
}