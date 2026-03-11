"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsLoggedIn(false);
        router.push("/login");
        router.refresh();
    };
    return (
        <nav className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="bg-black text-white font-bold px-2 py-1 rounded">
                DEV
            </Link>
            <div className="flex gap-2">
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium">Dashboard</Link>
                        <button onClick={handleLogout} className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition text-sm font-medium">
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="px-4 py-2 hover:bg-gray-100 rounded text-sm font-medium">Log in</Link>
                        <Link href="/register" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition text-sm font-medium">
                            Create account
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
