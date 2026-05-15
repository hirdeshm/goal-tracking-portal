"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful");
    }
  }

  async function handleLogin() {
    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful");
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[400px] rounded-lg border p-6">
        <h1 className="mb-6 text-3xl font-bold">
          Login
        </h1>

        <input
          className="mb-4 w-full border p-2"
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="mb-4 w-full border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="mb-2 w-full bg-black p-2 text-white"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="w-full border p-2"
        >
          Signup
        </button>
      </div>
    </div>
  );
}