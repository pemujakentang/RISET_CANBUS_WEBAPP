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
import 'chartjs-adapter-date-fns';

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

    const chartData = data.map(d => ({
        x: d.bucket.$date,
        y: d.odo,
    }));

    const chartDataObject = {
        datasets: [
            {
                label: 'Odometer (km)',
                data: chartData,
                borderColor: '#00000',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                pointBorderColor: '#ffffff',
                pointRadius: 1,
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
                    unit: 'hour' as const,
                    tooltipFormat: 'MMM d, HH:mm',
                    displayFormats: {
                        hour: 'MMM d, HH:mm',
                        day: 'MMM d',
                    },
                },
                ticks: {
                    color: '#000',
                },
                title: {
                    display: true,
                    text: 'Time',
                    color: '#000',
                },
                grid: { color: 'rgba(0, 0, 0, 0.2)' }
            },
            y: {
                ticks: {
                    color: '#000',
                },
                title: {
                    display: true,
                    text: 'Odometer (km)',
                    color: '#000',
                },
                grid: { color: 'rgba(0, 0, 0, 0.2)' }
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: 'Odometer History',
                color: '#000',
            }
        },
    };

    return (
        <div className="w-full h-[300px] bg-[#e6e6e6] p-4 rounded-xl relative"
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