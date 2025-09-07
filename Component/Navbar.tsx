"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md py-4 border-b border-gray-200">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Left Side: Logo + Title */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/man-marker.svg" alt="logo" width={40} height={40} />
          <span className="text-2xl font-bold text-gray-800">Travel Planner</span>
        </Link>

        {/* Right Side: Links + Button */}
        <div className="flex items-center space-x-6">
          

          {session ? (
            <>
              <Link href="/trips" className="text-slate-900 hover:text-sky-500">
            My Trips
          </Link>
          <Link href="/globe" className="text-slate-900 hover:text-sky-500">
            Globe
          </Link>
              <span className="mr-4">Hello, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-x-2 text-white px-4 py-2 rounded-md cursor-pointer bg-red-600 hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex items-center gap-x-2 text-white px-4 py-2 rounded-md cursor-pointer bg-gray-800 hover:bg-gray-900 transition"
            >
              Sign In
              <Image src="/icons8-github-100.png" alt="Github" width={20} height={20} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
