import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type TelemetryPoint = {
    t: number;
    value: number;
};

type TelemetryChartProps = {
    data: TelemetryPoint[];
    metric: string;
};

export default function TelemetryChart({ data, metric }: TelemetryChartProps) {
    const formatted = data.map((e): { time: string; value: number } => ({
        time: new Date(e.t).toLocaleTimeString("en-US", { hour12: false }),
        value: e.value,
    }));

    return (
        <div className="w-full h-[300px] bg-black p-4 rounded-xl shadow-md">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatted}>
                    <XAxis dataKey="time" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#00ff66" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
