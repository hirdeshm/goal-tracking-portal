"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserRole } from "@/lib/getUserRole";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");

        const userRole = await getUserRole(user.id);

        setRole(userRole);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <p className="mb-2">
        Email: {email}
      </p>

      <p className="mb-6">
        Role: {role}
      </p>

      {role === "employee" && (
        <div className="border p-4 rounded">
          Employee Dashboard
        </div>
      )}

      {role === "manager" && (
        <div className="border p-4 rounded">
          Manager Dashboard
        </div>
      )}

      {role === "admin" && (
        <div className="border p-4 rounded">
          Admin Dashboard
        </div>
      )}
    </div>
  );
}

<button
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }}
  className="mt-6 bg-black text-white px-4 py-2 rounded"
>
  Logout
</button>