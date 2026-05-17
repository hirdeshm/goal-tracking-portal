"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";

export default function ManagerApprovalsPage() {
  const [goalSheets, setGoalSheets] = useState<any[]>([]);

  useEffect(() => {
    fetchGoalSheets();
  }, []);

  async function fetchGoalSheets() {
    const { data, error } = await supabase
      .from("goal_sheets")
      .select(`
        *,
        goals (*)
      `);

    if (error) {
      console.log(error);
      return;
    }

    setGoalSheets(data || []);
  }

async function approveGoals(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const oldData = goalSheets.find(
    (g) => g.id === id
  );

  await supabase
    .from("goal_sheets")
    .update({
      status: "approved",
      locked: true,
    })
    .eq("id", id);

  await createAuditLog(
    user?.id || "",
    "approve",
    "goal_sheet",
    id,
    oldData,
    {
      status: "approved",
      locked: true,
    }
  );

  fetchGoalSheets();
}

 async function returnForRework(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const oldData = goalSheets.find(
    (g) => g.id === id
  );

  await supabase
    .from("goal_sheets")
    .update({
      status: "rework",
    })
    .eq("id", id);

  await createAuditLog(
    user?.id || "",
    "rework",
    "goal_sheet",
    id,
    oldData,
    {
      status: "rework",
    }
  );

  fetchGoalSheets();
}

 async function updateComment(
  goalId: string,
  comment: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const oldGoal = goalSheets
    .flatMap((s) => s.goals)
    .find((g) => g.id === goalId);

  await supabase
    .from("goals")
    .update({
      manager_comment: comment,
    })
    .eq("id", goalId);

  await createAuditLog(
    user?.id || "",
    "manager_comment",
    "goal",
    goalId,
    oldGoal,
    {
      manager_comment: comment,
    }
  );

  alert("Comment updated");

  fetchGoalSheets();
}

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-8">
        Manager Approvals
      </h1>

      {goalSheets.map((sheet) => (
        <div
          key={sheet.id}
          className="border rounded-xl p-6 mb-6"
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

          <div className="space-y-4 mb-6">
            {sheet.goals?.map((goal: any) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                updateComment={updateComment}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() =>
                approveGoals(sheet.id)
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={() =>
                returnForRework(sheet.id)
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Return
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalCard({
  goal,
  updateComment,
}: any) {
  const [comment, setComment] = useState(
    goal.manager_comment || ""
  );

  return (
    <div className="border p-4 rounded-lg bg-zinc-900">
      <p>
        <strong>Title:</strong>
        {" "}
        {goal.title}
      </p>

      <p>
        <strong>Thrust Area:</strong>
        {" "}
        {goal.thrust_area}
      </p>

      <p>
        <strong>UoM:</strong>
        {" "}
        {goal.uom_type}
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

      <p className="mb-4">
        <strong>Status:</strong>
        {" "}
        {goal.status}
      </p>

      <textarea
        className="border p-2 w-full mb-4 bg-black"
        placeholder="Manager Comment"
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
      />

      <button
        onClick={() =>
          updateComment(goal.id, comment)
        }
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Comment
      </button>
    </div>
  );
}