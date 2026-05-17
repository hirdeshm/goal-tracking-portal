"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  Users,
  FileText,
  Shield,
  Settings,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getUserRole } from "@/lib/getUserRole";

export default function Sidebar() {

  const [role, setRole] =
    useState("");

  useEffect(() => {

    async function loadRole() {

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user =
        session?.user;

      if (!user) return;

      const userRole =
        await getUserRole(user.id);

      setRole(userRole);
    }

    loadRole();

  }, []);

  return (
    <aside className="w-64 min-h-screen bg-[#030712] border-r border-zinc-900 p-6">

      {/* Logo */}
      <div className="mb-12">

        <h1 className="text-4xl font-black">

          <span className="text-green-400">
            Goal
          </span>

          {" "}Portal

        </h1>

      </div>

      {/* Navigation */}
      <nav className="space-y-3">

        {/* Employee */}
        {role === "employee" && (
          <>
            <NavItem
              href="/employee/home"
              title="Dashboard"
              icon={<LayoutDashboard size={20} />}
            />

            <NavItem
              href="/employee/goals"
              title="Goals"
              icon={<Target size={20} />}
            />

            <NavItem
              href="/employee/checkins"
              title="Check-ins"
              icon={<ClipboardCheck size={20} />}
            />
          </>
        )}

        {/* Manager */}
        {role === "manager" && (
          <>
            <NavItem
              href="/manager/home"
              title="Dashboard"
              icon={<LayoutDashboard size={20} />
            }
            />

            <NavItem
              href="/manager/approvals"
              title="Approvals"
              icon={<ClipboardCheck size={20} />}
            />
            <NavItem
                href="/manager/shared-goals"
                title="Shared KPI"
                icon={<Target size={20} />}
              />

          
          </>
        )}

        {/* Admin */}
        {role === "admin" && (
          <>
            <NavItem
              href="/admin/home"
              title="Dashboard"
              icon={<LayoutDashboard size={20} />}
            />

            <NavItem
              href="/admin/users"
              title="Users"
              icon={<Users size={20} />}
            />
            <NavItem
              href="/admin/shared-goals"
              title="Shared KPI"
              icon={<Target size={20} />}
            />

            <NavItem
              href="/admin/audit"
              title="Audit Logs"
              icon={<Shield size={20} />}
            />

            
          </>
        )}

      </nav>

    </aside>
  );
}

/* ---------- Nav Item ---------- */

function NavItem({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) {

  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#081120] border border-zinc-800 hover:border-green-500/40 hover:bg-green-500/10 transition-all duration-300 text-zinc-200 hover:text-green-400 font-medium"
    >

      <div>
        {icon}
      </div>

      <span>
        {title}
      </span>

    </Link>
  );
}