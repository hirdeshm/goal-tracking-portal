"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Goal = {
  title: string;
  description: string;
  thrust_area: string;
  uom_type: string;
  target_value: string;
  weightage: string;
};

type GoalErrors = {
  title?: string;
  description?: string;
  thrust_area?: string;
  target_value?: string;
  weightage?: string;
};

export default function GoalsPage() {

  const [goals, setGoals] =
    useState<Goal[]>([
      {
        title: "",
        description: "",
        thrust_area: "",
        uom_type: "Numeric",
        target_value: "",
        weightage: "",
      },
    ]);

  const [errors, setErrors] =
    useState<GoalErrors[]>([]);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const totalWeight =
    goals.reduce(
      (acc, goal) =>
        acc +
        (Number(goal.weightage) || 0),
      0
    );

  /* ---------- Add Goal ---------- */

  function addGoal() {

    if (goals.length >= 8) {

      alert(
        "Maximum number of goals is 8"
      );

      return;
    }

    setGoals([
      ...goals,
      {
        title: "",
        description: "",
        thrust_area: "",
        uom_type: "Numeric",
        target_value: "",
        weightage: "",
      },
    ]);
  }

  /* ---------- Update Goal ---------- */

  function updateGoal<
    K extends keyof Goal
  >(
    index: number,
    field: K,
    value: Goal[K]
  ) {

    const updated = [...goals];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setGoals(updated);
  }

  /* ---------- Validation ---------- */

  function validateGoals() {

    let valid = true;

    const newErrors:
      GoalErrors[] = [];

    if (goals.length > 8) {

      alert(
        "Maximum 8 goals allowed"
      );

      return false;
    }

    goals.forEach(
      (goal, index) => {

        const goalErrors:
          GoalErrors = {};

        if (
          !goal.title.trim()
        ) {

          goalErrors.title =
            "Goal title is required";

          valid = false;
        }

        if (
          !goal.description.trim()
        ) {

          goalErrors.description =
            "Description is required";

          valid = false;
        }

        if (
          !goal.thrust_area.trim()
        ) {

          goalErrors.thrust_area =
            "Please select thrust area";

          valid = false;
        }

        if (
          !goal.target_value ||
          Number(goal.target_value) <= 0
        ) {

          goalErrors.target_value =
            "Enter valid target";

          valid = false;
        }

        if (
          !goal.weightage ||
          Number(goal.weightage) < 10
        ) {

          goalErrors.weightage =
            "Minimum weightage is 10%";

          valid = false;
        }

        newErrors[index] =
          goalErrors;
      }
    );

    if (totalWeight !== 100) {

      alert(
        "Total weightage across all goals must equal 100%"
      );

      valid = false;
    }

    setErrors(newErrors);

    return valid;
  }

  /* ---------- Save Goals ---------- */

  async function saveGoals() {

    const isValid =
      validateGoals();

    if (!isValid) return;

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    const user =
      session?.user;

    if (!user) {

      alert("User not logged in");

      return;
    }

    const {
      data: sheet,
      error: sheetError,
    } = await supabase
      .from("goal_sheets")
      .insert({
        employee_id: user.id,
        status: "submitted",
      })
      .select()
      .single();

    if (sheetError || !sheet) {

      alert(
        "Failed to create goal sheet"
      );

      return;
    }

    const formattedGoals =
      goals.map((goal) => ({
        goal_sheet_id: sheet.id,
        title: goal.title,
        description:
          goal.description,
        thrust_area:
          goal.thrust_area,
        uom_type:
          goal.uom_type,
        target_value:
          Number(goal.target_value),
        weightage:
          Number(goal.weightage),
      }));

    const { error } =
      await supabase
        .from("goals")
        .insert(formattedGoals);

    if (error) {

      alert(error.message);

    } else {

      setShowSuccess(true);
    }
  }

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Goal Sheet
        </h1>

        <p className="text-zinc-400 text-lg">
          Create and submit your
          quarterly goals
        </p>

      </div>

      {/* Validation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <ValidationCard
          title="Total Goals"
          value={`${goals.length}/8`}
          valid={goals.length <= 8}
        />

        <ValidationCard
          title="Total Weightage"
          value={`${totalWeight}%`}
          valid={totalWeight === 100}
        />

        <ValidationCard
          title="Minimum Weight"
          value="10%"
          valid={goals.every(
            (goal) =>
              Number(goal.weightage) >= 10
          )}
        />

      </div>

      {/* Goals */}
      <div className="space-y-8">

        {goals.map(
          (goal, index) => (

            <div
              key={index}
              className="bg-[#081120] border border-zinc-800 rounded-3xl p-8"
            >

              {/* Top */}
              <div className="flex items-center justify-between mb-8">

                <h2 className="text-2xl font-bold">
                  Goal #{index + 1}
                </h2>

                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm">
                  {goal.weightage || 0}%
                  Weightage
                </div>

              </div>

              {/* Goal Title */}
              <div className="mb-6">

                <label className="block mb-3 text-zinc-300">
                  Goal Title
                </label>

                <input
                  type="text"
                  placeholder="Enter goal title"
                  value={goal.title}
                  onChange={(e) =>
                    updateGoal(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
                />

                {errors[index]
                  ?.title && (
                  <p className="text-red-400 text-sm mt-2">
                    {
                      errors[index]
                        ?.title
                    }
                  </p>
                )}

              </div>

              {/* Description */}
              <div className="mb-6">

                <label className="block mb-3 text-zinc-300">
                  Goal Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Describe your goal"
                  value={
                    goal.description
                  }
                  onChange={(e) =>
                    updateGoal(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500 resize-none"
                />

                {errors[index]
                  ?.description && (
                  <p className="text-red-400 text-sm mt-2">
                    {
                      errors[index]
                        ?.description
                    }
                  </p>
                )}

              </div>

              {/* Thrust + UOM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Thrust Area */}
                <div>

                  <label className="block mb-3 text-zinc-300">
                    Thrust Area
                  </label>

                  <select
                    value={
                      goal.thrust_area
                    }
                    onChange={(e) =>
                      updateGoal(
                        index,
                        "thrust_area",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
                  >

                    <option value="">
                      Select Area
                    </option>

                    <option>
                      Revenue Growth
                    </option>

                    <option>
                      Customer Success
                    </option>

                    <option>
                      Innovation
                    </option>

                    <option>
                      Operational Excellence
                    </option>

                    <option>
                      Team Development
                    </option>

                  </select>

                  {errors[index]
                    ?.thrust_area && (
                    <p className="text-red-400 text-sm mt-2">
                      {
                        errors[index]
                          ?.thrust_area
                      }
                    </p>
                  )}

                </div>

                {/* UOM */}
                <div>

                  <label className="block mb-3 text-zinc-300">
                    Unit of Measurement
                  </label>

                  <select
                    value={
                      goal.uom_type
                    }
                    onChange={(e) =>
                      updateGoal(
                        index,
                        "uom_type",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
                  >

                    <option>
                      Numeric
                    </option>

                    <option>
                      %
                    </option>

                    <option>
                      Timeline
                    </option>

                    <option>
                      Zero-based
                    </option>

                  </select>

                </div>

              </div>

              {/* Target + Weightage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Target */}
                <div>

                  <label className="block mb-3 text-zinc-300">
                    Target
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter target"
                    value={
                      goal.target_value
                    }
                    onChange={(e) => {

                      const value =
                        e.target.value;

                      if (
                        /^\d*$/.test(value)
                      ) {

                        updateGoal(
                          index,
                          "target_value",
                          value
                        );
                      }
                    }}
                    className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
                  />

                  {errors[index]
                    ?.target_value && (
                    <p className="text-red-400 text-sm mt-2">
                      {
                        errors[index]
                          ?.target_value
                      }
                    </p>
                  )}

                </div>

                {/* Weightage */}
                <div>

                  <label className="block mb-3 text-zinc-300">
                    Weightage %
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Minimum 10%"
                    value={
                      goal.weightage
                    }
                    onChange={(e) => {

                      const value =
                        e.target.value;

                      if (
                        /^\d*$/.test(value)
                      ) {

                        updateGoal(
                          index,
                          "weightage",
                          value
                        );
                      }
                    }}
                    className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-green-500"
                  />

                  {errors[index]
                    ?.weightage ? (
                    <p className="text-red-400 text-sm mt-2">
                      {
                        errors[index]
                          ?.weightage
                      }
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500 mt-2">
                      Minimum weightage:
                      10%
                    </p>
                  )}

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-5 mt-10">

        <button
          onClick={addGoal}
          className="bg-[#081120] border border-zinc-700 hover:border-green-500 px-8 py-4 rounded-2xl transition-all"
        >
          + Add Goal
        </button>

        <button
          onClick={saveGoals}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-all"
        >
          Submit Goal Sheet
        </button>

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
              Goal Sheet Submitted
            </h2>

            <p className="text-zinc-400 mb-8 leading-relaxed">
              Your goals have been successfully submitted for manager review.
            </p>

            <button
              onClick={() => {

                setShowSuccess(false);

                window.location.href =
                  "/employee/home";
              }}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-all"
            >
              Go To Dashboard
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

function ValidationCard({
  title,
  value,
  valid,
}: {
  title: string;
  value: string;
  valid: boolean;
}) {

  return (
    <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-6">

      <div className="flex items-center justify-between mb-4">

        <p className="text-zinc-400">
          {title}
        </p>

        <div
          className={`w-4 h-4 rounded-full ${
            valid
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />

      </div>

      <h2 className="text-4xl font-bold">
        {value}
      </h2>

    </div>
  );
}