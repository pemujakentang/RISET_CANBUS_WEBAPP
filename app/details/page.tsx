import { prisma } from "@/lib/prisma";

export default async function Details() {
    const users = await prisma.user.findMany();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users List</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul className="space-y-2">
                    {users.map((user) => (
                        <li key={user.id} className="p-2 border rounded">
                            <strong>{user.name}</strong> — {user.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
