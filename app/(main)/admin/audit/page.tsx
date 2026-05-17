"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setLogs(data || []);
  }

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-8">
        Audit Logs
      </h1>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="border rounded-xl p-6"
          >
            <p>
              <strong>Action:</strong>
              {" "}
              {log.action}
            </p>

            <p>
              <strong>Entity:</strong>
              {" "}
              {log.entity_type}
            </p>

            <p>
              <strong>Entity ID:</strong>
              {" "}
              {log.entity_id}
            </p>

            <p>
              <strong>User:</strong>
              {" "}
              {log.user_id}
            </p>

            <p>
              <strong>Time:</strong>
              {" "}
              {new Date(
                log.created_at
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}