"use client";

import Link from "next/link";

interface ParameterCardProps {
    name: string;
    value: number | string;
    unit?: string;
    color?: string;
    link: string;
}

export default function ParameterCard({
    name,
    value,
    unit,
    color = "text-gray-700",
    link,
}: ParameterCardProps) {
    return (
        <Link href={link}>
            <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 text-center cursor-pointer">
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className={`text-3xl font-bold ${color}`}>
                    {value} {unit}
                </p>
            </div>
        </Link>
    );
}
