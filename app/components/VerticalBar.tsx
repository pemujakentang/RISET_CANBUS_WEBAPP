interface VerticalBarProps {
    name: string;
    value: number; // 0–100
    color?: string; // base LED color
    width?: number;
    segments?: number; // default 20
}

export default function VerticalBar({
    name,
    value,
    color = "#EF1A2D",
    width = 60,
    segments = 20,
}: VerticalBarProps) {

    // how many LEDs should be ON
    const activeCount = Math.round((value / 100) * segments);

    // convert hex to RGB
    const hexToRgb = (hex: string) => {
        const clean = hex.replace("#", "");
        const bigint = parseInt(clean, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const base = hexToRgb(color);

    // progressively brighter/blended tones
    const getTone = (index: number) => {
        const t = (segments - index) / segments;

        // slight darkening at lower segments, full color at top
        const r = Math.round(base.r * (0.8 + t * 0.6));
        const g = Math.round(base.g * (0.8 + t * 0.6));
        const b = Math.round(base.b * (0.8 + t * 0.6));

        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div className="flex flex-col items-center justify-end bg-black text-white p-4 rounded-md shadow-md ">
            <div
                className="flex flex-col justify-end bg-black overflow-hidden rounded-md"
                style={{
                    width: width,
                    height: "100%",
                    padding: "4px",
                    border: "2px solid #111",
                    boxShadow: "0 0 6px #000 inset",
                }}
            >
                {[...Array(segments)].map((_, i) => {
                    const isOn = i >= segments - activeCount;
                    const tone = getTone(i);

                    return (
                        <div
                            key={i}
                            className="w-full flex-1 my-[1.5px] rounded-sm"
                            style={{
                                backgroundColor: isOn ? tone : "#222",
                                boxShadow: isOn
                                    ? `0 0 6px ${tone}`
                                    : "inset 0 0 4px #000",
                                transition: "all 0.2s ease",
                            }}
                        ></div>
                    );
                })}
            </div>

            <div className="mt-3 text-center">
                <p className="text-xl font-semibold">{name}</p>
                <p className="text-xl font-bold">{value}%</p>
            </div>
        </div>
    );
}
