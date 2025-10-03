import Link from "next/link";

export default function Header() {
    return (
        <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <h1 className="text-lg font-bold">My App</h1>
            <nav className="space-x-4">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/details">Details</Link>
            </nav>
        </header>
    );
}
