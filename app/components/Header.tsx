import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-[#EF1A2D] border-b-4 border-[#FFF200] text-white">
            <div className="flex justify-between items-center px-6 py-2">
                {/* Title */}
                <h1 className="text-3xl font-ferro tracking-wide drop-shadow-[3px_3px_0_#000000]">
                    Vehicle Dashboard
                </h1>

                {/* Navigation */}
                <nav className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="
                        font-transit text-lg text-black
                        px-4 py-1 rounded-md
                        bg-white
                        transition-all duration-200
                        shadow-[2px_2px_0_#000]
                        hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000]
                        active:translate-y-0 active:shadow-none"
                    >
                        Home
                    </Link>

                    <Link
                        href="/upload"
                        className="
                        font-transit text-lg text-black
                        px-4 py-1 rounded-md
                        bg-white
                        transition-all duration-200
                        shadow-[2px_2px_0_#000]
                        hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000]
                        active:translate-y-0 active:shadow-none"
                    >
                        Upload Config
                    </Link>

                    <select
                        className="
                        bg-white text-black font-transit
                        rounded-md px-3 py-1.5
                        border border-gray-300
                        shadow-[2px_2px_0_#000]
                        hover:border-[#FFF200]
                        focus:outline-none focus:ring-1 focus:ring-[#FFF200]
                        transition-all duration-150"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select Config
                        </option>
                        <option value="car1">Car 1</option>
                        <option value="car2">Car 2</option>
                        <option value="car3">Car 3</option>
                    </select>
                </nav>
            </div>
        </header>
    );
}
