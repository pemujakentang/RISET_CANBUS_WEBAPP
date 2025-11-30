interface HorizontalBarProps {
    value: number;
    max: number;
    name: string;
    segments?: number; // default 15
    onClick?: () => void;
}

export default function HorizontalBar({
    value,
    max,
    name,
    segments = 15,
    onClick,
}: HorizontalBarProps) {

    // how many LEDs should be lit
    const activeCount = Math.round((value / max) * segments);

    // calculate color for each LED (green → yellow → red)
    const getLedColor = (index: number) => {
        const ratio = index / segments;

        // simple gradient blend from green → yellow → red
        if (ratio < 0.5) {
            // green → yellow
            const t = ratio / 0.5;
            return `rgb(${Math.round(0 + t * 255)}, 255, 0)`; // 0,255,0 → 255,255,0
        } else {
            // yellow → red
            const t = (ratio - 0.5) / 0.5;
            return `rgb(255, ${Math.round(255 - t * 255)}, 0)`; // 255,255,0 → 255,0,0
        }
    };

    return (
        <div className="bg-black text-white p-4 rounded-xl shadow-md w-full h-fit hover:cursor-pointer" 
        onClick={onClick}>
            {/* <p className="text-xl text-center font-semibold">{name}</p> */}

            {/* LED BAR */}
            <div className="flex items-center gap-[3px] bg-black p-1 rounded-md"
                style={{ border: "2px solid #111", boxShadow: "0 0 6px #000 inset" }}>

                {[...Array(segments)].map((_, i) => {
                    const isOn = i < activeCount;
                    const color = getLedColor(i);

                    return (
                        <div
                            key={i}
                            className="h-8 flex-1 rounded-sm"
                            style={{
                                backgroundColor: isOn ? color : "#222",
                                boxShadow: isOn
                                    ? `0 0 8px ${color}`
                                    : "inset 0 0 4px #000",
                                transition: "all 0.2s ease",
                            }}
                        />
                    );
                })}
            </div>

            <p className="text-3xl text-center font-bold mt-2">{value} RPM</p>
        </div>
    );
}
