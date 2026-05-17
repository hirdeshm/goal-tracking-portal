"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSharedGoalsPage() {

  const [employees, setEmployees] =
    useState<any[]>([]);

  const [selectedEmployees, setSelectedEmployees] =
    useState<string[]>([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [target, setTarget] =
    useState("");

  const [uom, setUom] =
    useState("Numeric");

  const [weightage, setWeightage] =
    useState("");

  const [primaryOwner, setPrimaryOwner] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  useEffect(() => {

    fetchEmployees();

  }, []);

  /* ---------- Fetch Employees ---------- */

  async function fetchEmployees() {

    const { data } =
      await supabase
        .from("users")
        .select("*")
        .eq("role", "employee");

    setEmployees(data || []);
  }

  /* ---------- Toggle Employee ---------- */

  function toggleEmployee(
    id: string
  ) {

    if (
      selectedEmployees.includes(id)
    ) {

      setSelectedEmployees(
        selectedEmployees.filter(
          (e) => e !== id
        )
      );

    } else {

      setSelectedEmployees([
        ...selectedEmployees,
        id,
      ]);
    }
  }

  /* ---------- Create Shared Goal ---------- */

  async function createSharedGoal() {

    if (
      !title ||
      !target ||
      !weightage ||
      !primaryOwner
    ) {

      alert(
        "Please fill all required fields"
      );

      return;
    }

    const sharedGoalId =
      crypto.randomUUID();

    for (
      const employeeId of selectedEmployees
    ) {

      /* ---------- Create Goal Sheet ---------- */

      const {
        data: sheet,
      } =
        await supabase
          .from("goal_sheets")
          .insert({
            employee_id:
              employeeId,
            status: "pending",
          })
          .select()
          .single();

      if (!sheet) continue;

      /* ---------- Create Shared Goal ---------- */

      await supabase
        .from("goals")
        .insert({
          goal_sheet_id:
            sheet.id,

          title,

          description,

          thrust_area:
            "Department KPI",

          uom_type: uom,

          target_value:
            Number(target),

          weightage:
            Number(weightage),

          is_shared: true,

          shared_goal_id:
            sharedGoalId,

          primary_owner_id:
            primaryOwner,
        });
    }

    setShowSuccess(true);
  }

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Admin Shared KPI
        </h1>

        <p className="text-zinc-400 text-lg">
          Create organization-wide departmental KPIs
        </p>

      </div>

      {/* Main Card */}
      <div className="bg-[#081120] border border-zinc-800 rounded-3xl p-8">

        {/* Goal Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Goal Title */}
          <input
            type="text"
            placeholder="Goal Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          />

          {/* Target */}
          <input
            type="text"
            inputMode="numeric"
            placeholder="Target"
            value={target}
            onChange={(e) => {

              const value =
                e.target.value;

              if (
                /^\d*$/.test(value)
              ) {

                setTarget(value);
              }
            }}
            className="bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        {/* Description */}
        <textarea
          rows={4}
          placeholder="Goal Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 mb-6 resize-none outline-none"
        />

        {/* UOM + Weightage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* UOM */}
          <select
            value={uom}
            onChange={(e) =>
              setUom(
                e.target.value
              )
            }
            className="bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
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

          {/* Weightage */}
          <input
            type="text"
            inputMode="numeric"
            placeholder="Weightage %"
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
            className="bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        {/* Employee Selection */}
        <h2 className="text-2xl font-bold mb-5">
          Select Employees
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

          {employees.map(
            (employee) => (

              <div
                key={employee.id}
                onClick={() =>
                  toggleEmployee(
                    employee.id
                  )
                }
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedEmployees.includes(
                    employee.id
                  )
                    ? "bg-green-500/20 border-green-500"
                    : "bg-[#0f172a] border-zinc-700"
                }`}
              >

                <p className="font-bold">
                  {employee.email}
                </p>

              </div>
            )
          )}

        </div>

        {/* Primary Owner */}
        <div className="mb-8">

          <label className="block mb-3 text-zinc-300">
            Primary Owner
          </label>

          <select
            value={primaryOwner}
            onChange={(e) =>
              setPrimaryOwner(
                e.target.value
              )
            }
            className="w-full bg-[#0f172a] border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          >

            <option value="">
              Select Primary Owner
            </option>

            {employees.map(
              (employee) => (

                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.email}
                </option>
              )
            )}

          </select>

        </div>

        {/* Button */}
        <button
          onClick={createSharedGoal}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-all"
        >
          Create Shared KPI
        </button>

      </div>

      {/* Success Popup */}

      {showSuccess && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#081120] border border-green-500/20 rounded-3xl p-10 text-center w-[90%] max-w-md">

            <div className="text-5xl mb-5">
              ✅
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Shared KPI Created
            </h2>

            <p className="text-zinc-400 mb-8">
              Organization-wide KPI assigned successfully.
            </p>

            <button
              onClick={() =>
                setShowSuccess(false)
              }
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl"
            >
              Continue
            </button>

          </div>

        </div>

      )}

    </div>
  );
}