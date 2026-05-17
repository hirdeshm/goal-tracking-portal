"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";

export default function EmployeeCheckinsPage() {

  const [goals, setGoals] =
    useState<any[]>([]);

  const [showSuccess, setShowSuccess] =
    useState(false);

  useEffect(() => {

    fetchGoals();

  }, []);

  /* ---------- Fetch Goals ---------- */

  async function fetchGoals() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
      await supabase
        .from("goals")
        .select(`
          *,
          goal_sheets!inner(*)
        `)
        .eq(
          "goal_sheets.employee_id",
          user.id
        )
        .eq(
          "goal_sheets.status",
          "approved"
        );

    if (!error && data) {

      setGoals(data);
    }
  }

  /* ---------- Progress ---------- */

  function calculateProgress(
    target: number,
    actual: number
  ) {

    if (!target) return 0;

    return Math.min(
      Math.round(
        (actual / target) * 100
      ),
      100
    );
  }

  /* ---------- Update Progress ---------- */

  async function updateAchievement(
    goalId: string,
    achievement: number,
    status: string
  ) {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const oldGoal =
      goals.find(
        (g) =>
          g.id === goalId
      );

    const progress =
      calculateProgress(
        oldGoal?.target_value || 0,
        achievement
      );

    await supabase
      .from("goals")
      .update({
        achievement_value:
          achievement,
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
        achievement_value:
          achievement,
        status,
        progress,
      }
    );

    setShowSuccess(true);

    fetchGoals();
  }

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Quarterly Check-ins
        </h1>

        <p className="text-zinc-400 text-lg">
          Update your progress and performance
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <StatsCard
          title="Approved Goals"
          value={goals.length}
          color="green"
        />

        <StatsCard
          title="Completed"
          value={
            goals.filter(
              (g) =>
                g.status ===
                "Completed"
            ).length
          }
          color="blue"
        />

        <StatsCard
          title="On Track"
          value={
            goals.filter(
              (g) =>
                g.status ===
                "On Track"
            ).length
          }
          color="yellow"
        />

      </div>

      {/* Goal Cards */}
      <div className="space-y-8">

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

      {/* Success Popup */}

      {showSuccess && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#081120] border border-green-500/30 rounded-3xl p-10 w-[90%] max-w-md text-center">

            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">

              <span className="text-5xl">
                ✅
              </span>

            </div>

            <h2 className="text-3xl font-bold mb-4">
              Progress Updated
            </h2>

            <p className="text-zinc-400 mb-8 leading-relaxed">
              Your quarterly check-in has been successfully updated.
            </p>

            <button
              onClick={() =>
                setShowSuccess(false)
              }
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-all"
            >
              Continue
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

/* ---------- Goal Card ---------- */

function CheckinCard({
  goal,
  updateAchievement,
}: any) {

  const [achievement, setAchievement] =
    useState(
      goal.achievement_value || ""
    );

  const [status, setStatus] =
    useState(
      goal.status ||
      "Not Started"
    );

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-8">

      {/* Top */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

        <div>

          <h2 className="text-3xl font-bold mb-3">
            {goal.title}
          </h2>

          <p className="text-zinc-400 leading-relaxed max-w-3xl">
            {goal.description}
          </p>

        </div>

        <div
          className={`px-5 py-3 rounded-2xl text-sm font-semibold w-fit ${
            goal.status ===
            "Completed"
              ? "bg-green-500/20 text-green-400"
              : goal.status ===
                "On Track"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-zinc-700 text-zinc-300"
          }`}
        >
          {goal.status ||
            "Not Started"}
        </div>

      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <InfoCard
          title="Target"
          value={
            goal.target_value
          }
        />

        <InfoCard
          title="Weightage"
          value={`${goal.weightage}%`}
        />

        <InfoCard
          title="Progress"
          value={`${
            goal.progress || 0
          }%`}
        />

      </div>

      {/* Progress Bar */}
      <div className="mb-8">

        <div className="flex justify-between mb-3">

          <p className="text-zinc-300">
            Goal Completion
          </p>

          <p className="text-green-400 font-semibold">
            {goal.progress || 0}%
          </p>

        </div>

        <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                goal.progress || 0
              }%`,
            }}
          />

        </div>

      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Achievement */}
        <div>

          <label className="block mb-3 text-zinc-300">
            Achievement Value
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter achievement"
            value={achievement}
            onChange={(e) => {

              const value =
                e.target.value;

              if (
                /^\d*$/.test(value)
              ) {

                setAchievement(
                  value
                );
              }
            }}
            className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
          />

        </div>

        {/* Status */}
        <div>

          <label className="block mb-3 text-zinc-300">
            Current Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
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

        </div>

      </div>

      {/* Button */}
      <button
        onClick={() =>
          updateAchievement(
            goal.id,
            Number(achievement),
            status
          )
        }
        className="mt-8 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-all"
      >
        Update Progress
      </button>

    </div>
  );
}

/* ---------- Stats Card ---------- */

function StatsCard({
  title,
  value,
  color,
}: any) {

  const colors: any = {
    green:
      "bg-green-500/20 text-green-400",
    blue:
      "bg-blue-500/20 text-blue-400",
    yellow:
      "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-6">

      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}
      >
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

/* ---------- Info Card ---------- */

function InfoCard({
  title,
  value,
}: any) {

  return (
    <div className="bg-[#0f172a] border border-zinc-800 rounded-2xl p-5">

      <p className="text-zinc-400 text-sm mb-2">
        {title}
      </p>

      <h3 className="text-2xl font-bold">
        {value}
      </h3>

    </div>
  );
}