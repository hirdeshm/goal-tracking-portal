"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";

export default function ManagerApprovalsPage() {

  const [goalSheets, setGoalSheets] =
    useState<any[]>([]);

  const [popup, setPopup] =
    useState("");

  useEffect(() => {

    fetchGoalSheets();

  }, []);

  /* ---------- Fetch Goal Sheets ---------- */

  async function fetchGoalSheets() {

    const { data, error } =
      await supabase
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

  /* ---------- Approve ---------- */

  async function approveGoals(
    id: string
  ) {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const oldData =
      goalSheets.find(
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

    setPopup(
      "Goal sheet approved and locked successfully."
    );

    fetchGoalSheets();
  }

  /* ---------- Return ---------- */

  async function returnForRework(
    id: string
  ) {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const oldData =
      goalSheets.find(
        (g) => g.id === id
      );

    await supabase
      .from("goal_sheets")
      .update({
        status: "rework",
        locked: false,
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
        locked: false,
      }
    );

    setPopup(
      "Goal sheet returned for rework."
    );

    fetchGoalSheets();
  }

  /* ---------- Update Goal ---------- */

  async function updateGoalInline(
    goalId: string,
    target: number,
    weightage: number
  ) {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const oldGoal =
      goalSheets
        .flatMap(
          (s) => s.goals
        )
        .find(
          (g) =>
            g.id === goalId
        );

    await supabase
      .from("goals")
      .update({
        target_value: target,
        weightage,
      })
      .eq("id", goalId);

    await createAuditLog(
      user?.id || "",
      "edit_goal",
      "goal",
      goalId,
      oldGoal,
      {
        target_value: target,
        weightage,
      }
    );

    setPopup(
      "Goal updated successfully."
    );

    fetchGoalSheets();
  }

  /* ---------- Manager Comment ---------- */

  async function updateComment(
    goalId: string,
    comment: string
  ) {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const oldGoal =
      goalSheets
        .flatMap(
          (s) => s.goals
        )
        .find(
          (g) =>
            g.id === goalId
        );

    await supabase
      .from("goals")
      .update({
        manager_comment:
          comment,
      })
      .eq("id", goalId);

    await createAuditLog(
      user?.id || "",
      "manager_comment",
      "goal",
      goalId,
      oldGoal,
      {
        manager_comment:
          comment,
      }
    );

    setPopup(
      "Manager comment saved."
    );

    fetchGoalSheets();
  }

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Manager Approvals
        </h1>

        <p className="text-zinc-400 text-lg">
          Review, edit, approve or return employee goals
        </p>

      </div>

      {/* Goal Sheets */}
      <div className="space-y-10">

        {goalSheets.map(
          (sheet) => (

            <div
              key={sheet.id}
              className="bg-[#081120] border border-zinc-800 rounded-3xl p-8"
            >

              {/* Top */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

                <div>

                  <h2 className="text-3xl font-bold mb-3">
                    Employee Goal Sheet
                  </h2>

                  <p className="text-zinc-400">
                    Employee ID:
                    {" "}
                    {
                      sheet.employee_id
                    }
                  </p>

                </div>

                <div
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold w-fit ${
                    sheet.status ===
                    "approved"
                      ? "bg-green-500/20 text-green-400"
                      : sheet.status ===
                        "rework"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {sheet.status}
                </div>

              </div>

              {/* Lock Info */}
              {sheet.locked && (

                <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-5 mb-8">

                  🔒 This goal sheet is locked after approval.
                  No further edits allowed without Admin intervention.

                </div>

              )}

              {/* Goals */}
              <div className="space-y-6 mb-8">

                {sheet.goals?.map(
                  (goal: any) => (

                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      locked={
                        sheet.locked
                      }
                      updateComment={
                        updateComment
                      }
                      updateGoalInline={
                        updateGoalInline
                      }
                    />

                  )
                )}

              </div>

              {/* Buttons */}
              {!sheet.locked && (

                <div className="flex flex-wrap gap-5">

                  <button
                    onClick={() =>
                      approveGoals(
                        sheet.id
                      )
                    }
                    className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-all"
                  >
                    Approve & Lock
                  </button>

                  <button
                    onClick={() =>
                      returnForRework(
                        sheet.id
                      )
                    }
                    className="bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-4 rounded-2xl transition-all"
                  >
                    Return For Rework
                  </button>

                </div>

              )}

            </div>
          )
        )}

      </div>

      {/* Popup */}
      {popup && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#081120] border border-green-500/20 rounded-3xl p-10 w-[90%] max-w-md text-center">

            <div className="text-5xl mb-5">
              ✅
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Success
            </h2>

            <p className="text-zinc-400 mb-8 leading-relaxed">
              {popup}
            </p>

            <button
              onClick={() =>
                setPopup("")
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

function GoalCard({
  goal,
  locked,
  updateComment,
  updateGoalInline,
}: any) {

  const [comment, setComment] =
    useState(
      goal.manager_comment ||
      ""
    );

  const [target, setTarget] =
    useState(
      goal.target_value || ""
    );

  const [weightage, setWeightage] =
    useState(
      goal.weightage || ""
    );

  return (
    <div className="bg-[#0f172a] border border-zinc-800 rounded-3xl p-6">

      {/* Top */}
      <div className="flex items-center justify-between mb-6">

        <h3 className="text-2xl font-bold">
          {goal.title}
        </h3>

        <div
          className={`px-4 py-2 rounded-xl text-sm ${
            goal.status ===
            "Completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {goal.status ||
            "Pending"}
        </div>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        <InfoCard
          title="Thrust Area"
          value={
            goal.thrust_area
          }
        />

        <InfoCard
          title="UoM"
          value={goal.uom_type}
        />

        <InfoCard
          title="Achievement"
          value={
            goal.achievement_value ||
            0
          }
        />

        <InfoCard
          title="Progress"
          value={`${
            goal.progress || 0
          }%`}
        />

      </div>

      {/* Editable Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Target */}
        <div>

          <label className="block mb-3 text-zinc-300">
            Target Value
          </label>

          <input
            disabled={locked}
            type="text"
            inputMode="numeric"
            value={target}
            onChange={(e) => {

              const value =
                e.target.value;

              if (
                /^\d*$/.test(value)
              ) {

                setTarget(
                  value
                );
              }
            }}
            className="w-full bg-[#081120] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none disabled:opacity-50"
          />

        </div>

        {/* Weightage */}
        <div>

          <label className="block mb-3 text-zinc-300">
            Weightage %
          </label>

          <input
            disabled={locked}
            type="text"
            inputMode="numeric"
            value={weightage}
            onChange={(e) => {

              const value =
                e.target.value;

              if (
                /^\d*$/.test(value)
              ) {

                setWeightage(
                  value
                );
              }
            }}
            className="w-full bg-[#081120] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none disabled:opacity-50"
          />

        </div>

      </div>

      {/* Comment */}
      <div className="mb-6">

        <label className="block mb-3 text-zinc-300">
          Manager Comment
        </label>

        <textarea
          rows={4}
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Provide manager feedback..."
          className="w-full bg-[#081120] border border-zinc-700 rounded-2xl px-5 py-4 text-white resize-none outline-none"
        />

      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4">

        {!locked && (

          <button
            onClick={() =>
              updateGoalInline(
                goal.id,
                Number(target),
                Number(
                  weightage
                )
              )
            }
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-2xl transition-all"
          >
            Save Goal Changes
          </button>

        )}

        <button
          onClick={() =>
            updateComment(
              goal.id,
              comment
            )
          }
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-2xl transition-all"
        >
          Save Comment
        </button>

      </div>

    </div>
  );
}

/* ---------- Info Card ---------- */

function InfoCard({
  title,
  value,
}: any) {

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-2xl p-5">

      <p className="text-zinc-400 text-sm mb-2">
        {title}
      </p>

      <h3 className="text-xl font-bold">
        {value}
      </h3>

    </div>
  );
}