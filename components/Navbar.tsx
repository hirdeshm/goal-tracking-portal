"use client";

import { supabase } from "@/lib/supabase";

export default function Navbar() {

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#050816]">

      <h1 className="text-2xl font-bold">
        Performance Management
      </h1>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl font-semibold"
      >
        Logout
      </button>

    </div>
  );
}