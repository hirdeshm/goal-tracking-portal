"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";

export default function EmployeeCheckinsPage() {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("goals")
      .select(`
        *,
        goal_sheets!inner(*)
      `)
      .eq("goal_sheets.employee_id", user.id)
      .eq("goal_sheets.status", "approved");

    if (!error && data) {
      setGoals(data);
    }
  }

  function calculateProgress(
    target: number,
    actual: number
  ) {
    if (!target) return 0;

    return Math.round((actual / target) * 100);
  }

 async function updateAchievement(
  goalId: string,
  achievement: number,
  status: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const oldGoal = goals.find(
    (g) => g.id === goalId
  );

  const progress = calculateProgress(
    oldGoal?.target_value || 0,
    achievement
  );

  await supabase
    .from("goals")
    .update({
      achievement_value: achievement,
      status,
      progress,
    })
    .eq("id", goalId);

  await createAuditLog(
    user?.id || "",
    "update_progress",
    "goal",
    goalId,
    oldGoal,
    {
      achievement_value: achievement,
      status,
      progress,
    }
  );

  alert("Progress updated");

  fetchGoals();
}

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-8">
        Quarterly Check-ins
      </h1>

      {goals.map((goal) => (
        <CheckinCard
          key={goal.id}
          goal={goal}
          updateAchievement={
            updateAchievement
          }
        />
      ))}
    </div>
  );
}

function CheckinCard({
  goal,
  updateAchievement,
}: any) {
  const [achievement, setAchievement] =
    useState(goal.achievement_value || 0);

  const [status, setStatus] = useState(
    goal.status || "Not Started"
  );

  return (
    <div className="border rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {goal.title}
      </h2>

      <p className="mb-2">
        Target:
        {" "}
        {goal.target_value}
      </p>

      <p className="mb-2">
        Weightage:
        {" "}
        {goal.weightage}%
      </p>

      <p className="mb-6">
        Current Progress:
        {" "}
        {goal.progress || 0}%
      </p>

      <input
        type="number"
        className="border p-2 w-full mb-4"
        placeholder="Achievement"
        value={achievement}
        onChange={(e) =>
          setAchievement(Number(e.target.value))
        }
      />

      <select
        className="border p-2 w-full mb-4 bg-black"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option>
          Not Started
        </option>

        <option>
          On Track
        </option>

        <option>
          Completed
        </option>
      </select>

      <button
        onClick={() =>
          updateAchievement(
            goal.id,
            achievement,
            status
          )
        }
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Progress
      </button>
    </div>
  );
}