"use client";

import Link from "next/link";

interface ParameterCardProps {
    name: string;
    value: number | string;
    unit?: string;
    color?: string; // ignored for LCD mode
    link?: string;
    onClick?: () => void;
}

export default function ParameterCard({
    name,
    value,
    unit,
    link,
    onClick,
}: ParameterCardProps) {
    const Wrapper = link ? Link : "div";
    const props = link ? { href: link } : { onClick };

    const cardContent = (
        <div
            onClick={link ? undefined : onClick}>
            <div className="bg-[#0d0d0d] p-4 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer w-96">

                {/* LCD Screen Container */}
                <div
                    className="
                        bg-[#b8ff9b] 
                        text-[#003300]
                        rounded-md 
                        p-4 
                        shadow-inner 
                        border-2 border-[#6ca86c]
                        tracking-wider 
                        font-7segment
                        relative
                    "
                    style={{
                        boxShadow:
                            "inset 0 0 10px #5fa35f, 0 0 10px rgba(0,255,0,0.2)",
                    }}
                >
                    {/* Optional subtle grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundSize: "6px 6px",
                            backgroundImage:
                                "linear-gradient(#00000012 1px, transparent 1px), linear-gradient(90deg, #00000012 1px, transparent 1px)",
                        }}
                    />

                    <h2 className="text-lg mb-2 font-bold relative z-10">{name}</h2>
                    <p className="text-3xl font-bold relative z-10">
                        {value} {unit}
                    </p>
                </div>

            </div>
        </div>
    )

    if (link) {
        return <Link href={link}>{cardContent}</Link>;
    }

    return cardContent;
}
