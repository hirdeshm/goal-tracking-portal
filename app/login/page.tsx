"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { getUserRole } from "@/lib/getUserRole";
export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleSignup() {
    const { error } = await signUp(
      email,
      password
    );

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful");
    }
  }

async function handleLogin() {

  const { data, error } =
    await signIn(email, password);

  if (error) {

    alert(error.message);

    return;
  }

  const user =
    data.user;

  if (!user) return;

  const role =
    await getUserRole(user.id);

  if (role === "employee") {

    window.location.href =
      "/employee/home";

  } else if (role === "manager") {

    window.location.href =
      "/manager/home";

  } else if (role === "admin") {

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
      <div className="relative z-10 w-full max-w-[420px] bg-[#081120] border border-zinc-800 rounded-[32px] p-10 transition-all duration-500 hover:scale-[1.01] shadow-[0_0_60px_rgba(34,197,94,0.15)]">

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
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none"
            onChange={(e) =>
              setEmail(e.target.value)
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

        {/* Buttons */}
        <div className="space-y-4">

          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-all duration-300"
          >
            Login →
          </button>

          <button
            onClick={handleSignup}
            className="w-full border border-zinc-700 hover:border-green-500 text-white py-4 rounded-2xl transition-all duration-300"
          >
            Create Account
          </button>

        </div>

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
    </div>
  );
}