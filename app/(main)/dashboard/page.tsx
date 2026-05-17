"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserRole } from "@/lib/getUserRole";

export default function DashboardPage() {

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("");

  useEffect(() => {

    async function loadUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {

        setEmail(user.email || "");

        const userRole =
          await getUserRole(user.id);

        setRole(userRole);
      }
    }

    loadUser();

  }, []);

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Dashboard
        </h1>

        <p className="text-zinc-400 text-lg">
          Welcome back to your workspace
        </p>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <StatCard
          title="Total Goals"
          value="08"
          color="green"
        />

        <StatCard
          title="Completed"
          value="05"
          color="blue"
        />

        <StatCard
          title="Pending"
          value="02"
          color="yellow"
        />

        <StatCard
          title="Approvals"
          value="01"
          color="red"
        />

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">

          <h2 className="text-2xl font-bold mb-6">
            Profile Information
          </h2>

          <div className="space-y-6">

            {/* Email */}
            <div className="bg-[#0f172a] rounded-2xl p-4 border border-zinc-800">

              <p className="text-zinc-500 text-sm mb-2">
                Email Address
              </p>

              <p className="text-lg font-semibold break-all">
                {email || "Loading..."}
              </p>

            </div>

            {/* Role */}
            <div className="bg-[#0f172a] rounded-2xl p-4 border border-zinc-800">

              <p className="text-zinc-500 text-sm mb-2">
                User Role
              </p>

              <p className="text-lg font-semibold capitalize text-green-400">
                {role || "Loading..."}
              </p>

            </div>

          </div>

        </div>

        {/* Performance Overview */}
        <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-6 xl:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">

          <h2 className="text-2xl font-bold mb-8">
            Performance Overview
          </h2>

          <div className="space-y-6">

            <ProgressBar
              title="Quarterly Goals"
              value={75}
            />

            <ProgressBar
              title="Project Completion"
              value={60}
            />

            <ProgressBar
              title="Manager Review"
              value={90}
            />

          </div>

        </div>

      </div>

      {/* Role Based Section */}
      <div className="mt-10">

        {role === "employee" && (
          <RoleCard
            title="Employee Dashboard"
            description="Track goals, submit updates, and manage your quarterly progress."
          />
        )}

        {role === "manager" && (
          <RoleCard
            title="Manager Dashboard"
            description="Review employee goals, approvals, and team performance."
          />
        )}

        {role === "admin" && (
          <RoleCard
            title="Admin Dashboard"
            description="Manage users, audit logs, and organization monitoring."
          />
        )}

      </div>

    </div>
  );
}

/* ---------- Stat Card ---------- */

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {

  const colors: any = {
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    red: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
        ●
      </div>

      <p className="text-zinc-400 mb-2">
        {title}
      </p>

      <h2 className="text-4xl font-bold">
        {value}
      </h2>

    </div>
  );
}

/* ---------- Progress Bar ---------- */

function ProgressBar({
  title,
  value,
}: {
  title: string;
  value: number;
}) {

  return (
    <div>

      <div className="flex justify-between mb-2">

        <p className="font-medium">
          {title}
        </p>

        <p className="text-green-400 font-semibold">
          {value}%
        </p>

      </div>

      <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">

        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

/* ---------- Role Card ---------- */

function RoleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">

      <h2 className="text-3xl font-bold mb-4">
        {title}
      </h2>

      <p className="text-zinc-400 text-lg leading-relaxed">
        {description}
      </p>

    </div>
  );
}