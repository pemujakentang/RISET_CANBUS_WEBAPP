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
    TimeScale, // ⭐️ TimeScale is essential for chronological data
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // ⭐️ Import the adapter

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

type OdometerRecord = {
    odo: number;
    bucket: {
        $date: string;
    };
};
type OdometerChartProps = {
    data: OdometerRecord[];
    metric: string;
};

export default function OdometerChart({ data, metric }: OdometerChartProps) {

    // Transform the data to the format Chart.js Time Scale expects: {x: timestamp, y: value}
    const chartData = data.map(d => ({
        x: d.bucket.$date,
        y: d.odo,
    }));

    // Data object for react-chartjs-2
    const chartDataObject = {
        datasets: [
            {
                label: 'Odometer (km)',
                data: chartData,
                borderColor: '#00ff66',
                backgroundColor: 'rgba(0, 255, 102, 0.1)',
                pointBorderColor: '#ffffff',
                pointRadius: 1, // No dots for high-density data
                tension: 0.2, // Smooth the line
            },
        ],
    };

    // Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            // ⭐️ Configure the Time Scale for the X-axis
            x: {
                type: 'time' as const,
                time: {
                    unit: 'hour' as const, // Default unit, will adjust dynamically
                    tooltipFormat: 'MMM d, HH:mm',
                    displayFormats: {
                        hour: 'MMM d, HH:mm',
                        day: 'MMM d',
                    },
                },
                ticks: {
                    color: '#aaa',
                },
                title: {
                    display: true,
                    text: 'Time',
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            },
            // Configure the Linear Scale for the Y-axis
            y: {
                ticks: {
                    color: '#aaa',
                },
                title: {
                    display: true,
                    text: 'Odometer (km)',
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Odometer History',
                color: '#fff',
            }
        }
    };

    return (
        <div className="w-full h-[300px] bg-black p-4 rounded-xl shadow-md">
            {/* The Line component from react-chartjs-2 */}
            <Line data={chartDataObject} options={options} />
        </div>
    );
}