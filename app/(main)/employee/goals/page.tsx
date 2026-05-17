"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Goal = {
  title: string;
  thrust_area: string;
  uom_type: string;
  target_value: number;
  weightage: number;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      title: "",
      thrust_area: "",
      uom_type: "Numeric",
      target_value: 0,
      weightage: 0,
    },
  ]);

  function addGoal() {
    if (goals.length >= 8) {
      alert("Maximum 8 goals allowed");
      return;
    }

    setGoals([
      ...goals,
      {
        title: "",
        thrust_area: "",
        uom_type: "Numeric",
        target_value: 0,
        weightage: 0,
      },
    ]);
  }

  function updateGoal(
    index: number,
    field: keyof Goal,
    value: any
  ) {
    const updated = [...goals];

    updated[index][field] = value;

    setGoals(updated);
  }

  function validateGoals() {
    const totalWeight = goals.reduce(
      (acc, g) => acc + Number(g.weightage),
      0
    );

    if (totalWeight !== 100) {
      alert("Total weightage must equal 100%");
      return;
    }

    for (const goal of goals) {
      if (goal.weightage < 10) {
        alert(
          "Each goal must have minimum 10% weightage"
        );
        return;
      }
    }

    alert("Validation successful");
  }

  async function saveGoals() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not logged in");
      return;
    }

    const { data: sheet, error: sheetError } =
      await supabase
        .from("goal_sheets")
        .insert({
          employee_id: user.id,
          status: "submitted",
        })
        .select()
        .single();

    if (sheetError || !sheet) {
      alert("Failed to create goal sheet");
      return;
    }

    const formattedGoals = goals.map((goal) => ({
      goal_sheet_id: sheet.id,
      title: goal.title,
      thrust_area: goal.thrust_area,
      uom_type: goal.uom_type,
      target_value: goal.target_value,
      weightage: goal.weightage,
    }));

    const { error } = await supabase
      .from("goals")
      .insert(formattedGoals);

    if (error) {
      alert(error.message);
    } else {
      alert("Goals saved successfully");
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Employee Goals
      </h1>

      {goals.map((goal, index) => (
        <div
          key={index}
          className="border p-6 rounded-xl mb-4 bg-zinc-900"
        >
          <input
            className="border p-2 w-full mb-2"
            placeholder="Goal Title"
            onChange={(e) =>
              updateGoal(
                index,
                "title",
                e.target.value
              )
            }
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="Thrust Area"
            onChange={(e) =>
              updateGoal(
                index,
                "thrust_area",
                e.target.value
              )
            }
          />

          <select
            className="border p-2 w-full mb-2 bg-black"
            onChange={(e) =>
              updateGoal(
                index,
                "uom_type",
                e.target.value
              )
            }
          >
            <option value="Numeric">
              Numeric
            </option>

            <option value="%">
              %
            </option>

            <option value="Timeline">
              Timeline
            </option>

            <option value="Zero">
              Zero
            </option>
          </select>

          <input
            type="number"
            className="border p-2 w-full mb-2"
            placeholder="Target Value"
            onChange={(e) =>
              updateGoal(
                index,
                "target_value",
                Number(e.target.value)
              )
            }
          />

          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Weightage"
            onChange={(e) =>
              updateGoal(
                index,
                "weightage",
                Number(e.target.value)
              )
            }
          />
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addGoal}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Goal
        </button>

        <button
          onClick={validateGoals}
          className="border px-4 py-2 rounded"
        >
          Validate
        </button>

        <button
          onClick={saveGoals}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}