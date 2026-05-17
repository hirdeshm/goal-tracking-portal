"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { getUserRole } from "@/lib/getUserRole";

export default function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showError, setShowError] =
    useState(false);

  /* ---------- Login ---------- */

  async function handleLogin() {

    const { data, error } =
      await signIn(
        email,
        password
      );

    if (error) {

      setShowError(true);

      return;
    }

    const user =
      data.user;

    if (!user) {

      setShowError(true);

      return;
    }

    const role =
      await getUserRole(user.id);

    if (role === "employee") {

      window.location.href =
        "/employee/home";

    } else if (
      role === "manager"
    ) {

      window.location.href =
        "/manager/home";

    } else if (
      role === "admin"
    ) {

      window.location.href =
        "/admin/home";

    } else {

      window.location.href =
        "/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[450px] h-[450px] bg-green-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[450px] h-[450px] bg-green-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#081120] border border-zinc-800 rounded-[32px] p-10 transition-all duration-500 shadow-[0_0_60px_rgba(34,197,94,0.15)]">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-4xl">
            🎯
          </div>

        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-3 text-white">

          Welcome
          {" "}

          <span className="text-green-400">
            Back
          </span>

        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Performance Management System
        </p>

        {/* Email */}
        <div className="mb-5">

          <label className="block mb-2 text-zinc-300">
            Employee Email
          </label>

          <input
            type="email"
            placeholder="Enter company email"
            className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none"
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

        </div>

        {/* Password */}
        <div className="mb-8">

          <label className="block mb-2 text-zinc-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none"
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-all duration-300"
        >
          Login →
        </button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">

          <p className="text-zinc-500 text-sm">
            🔒 Secure • Reliable • Enterprise Ready
          </p>

          <p className="text-zinc-700 text-xs mt-2">
            Goal Tracking & Performance System
          </p>

        </div>

      </div>

      {/* Error Popup */}

      {showError && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#081120] border border-red-500/30 rounded-3xl p-10 w-[90%] max-w-md text-center">

            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">

              <span className="text-5xl">
                ❌
              </span>

            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold mb-4 text-white">
              Invalid Credentials
            </h2>

            {/* Message */}
            <p className="text-zinc-400 leading-relaxed mb-8">

              Your login credentials do not match our records.

              <br />
              <br />

              Please contact the administrative department to receive valid employee credentials.

              <br />
              <br />

              If you do not have login access, kindly reach out to your organization administrator.

            </p>

            {/* Button */}
            <button
              onClick={() =>
                setShowError(false)
              }
              className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-4 rounded-2xl transition-all"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}