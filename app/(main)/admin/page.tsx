"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalGoalSheets: 0,
    approvedGoals: 0,
    submittedGoals: 0,
    reworkGoals: 0,
    completedGoals: 0,
  });

  const [goalSheets, setGoalSheets] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    const { data: sheets } = await supabase
      .from("goal_sheets")
      .select(`
        *,
        goals (*)
      `);

    if (!sheets) return;

    setGoalSheets(sheets);

    const approved = sheets.filter(
      (s) => s.status === "approved"
    ).length;

    const submitted = sheets.filter(
      (s) => s.status === "submitted"
    ).length;

    const rework = sheets.filter(
      (s) => s.status === "rework"
    ).length;

    let completed = 0;

    sheets.forEach((sheet) => {
      sheet.goals?.forEach((goal: any) => {
        if (goal.status === "Completed") {
          completed++;
        }
      });
    });

    setStats({
      totalGoalSheets: sheets.length,
      approvedGoals: approved,
      submittedGoals: submitted,
      reworkGoals: rework,
      completedGoals: completed,
    });
  }

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <DashboardCard
          title="Total Goal Sheets"
          value={stats.totalGoalSheets}
        />

        <DashboardCard
          title="Approved"
          value={stats.approvedGoals}
        />

        <DashboardCard
          title="Submitted"
          value={stats.submittedGoals}
        />

        <DashboardCard
          title="Rework"
          value={stats.reworkGoals}
        />

        <DashboardCard
          title="Completed Goals"
          value={stats.completedGoals}
        />
      </div>

      <div className="space-y-6">
        {goalSheets.map((sheet) => (
          <div
            key={sheet.id}
            className="border rounded-xl p-6"
          >
            <p className="mb-2 text-lg">
              Employee ID:
              {" "}
              {sheet.employee_id}
            </p>

            <p className="mb-6">
              Status:
              {" "}
              {sheet.status}
            </p>

            <div className="space-y-4">
              {sheet.goals?.map((goal: any) => (
                <div
                  key={goal.id}
                  className="border rounded-lg p-4 bg-zinc-900"
                >
                  <p>
                    <strong>Title:</strong>
                    {" "}
                    {goal.title}
                  </p>

                  <p>
                    <strong>Target:</strong>
                    {" "}
                    {goal.target_value}
                  </p>

                  <p>
                    <strong>Achievement:</strong>
                    {" "}
                    {goal.achievement_value || 0}
                  </p>

                  <p>
                    <strong>Progress:</strong>
                    {" "}
                    {goal.progress || 0}%
                  </p>

                  <p>
                    <strong>Status:</strong>
                    {" "}
                    {goal.status}
                  </p>

                  <p>
                    <strong>Manager Comment:</strong>
                    {" "}
                    {goal.manager_comment ||
                      "No comment"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="border rounded-xl p-6 bg-zinc-900">
      <h2 className="text-lg mb-2">
        {title}
      </h2>

      <p className="text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}