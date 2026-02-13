"use client";

import { useState } from "react";
import {
  LifeEvent,
  LifeEventType,
  ChildEventParams,
  CareerBreakParams,
  CareerChangeParams,
  InheritanceParams,
  RedundancyParams,
  PartTimeParams,
  RetirementParams,
} from "@/lib/projections/types";
import { createChildEvent, createCareerBreakEvent, createInheritanceEvent, createRetirementEvent } from "@/lib/projections/life-events";
import { Plus, Trash2, Baby, Briefcase, Gift, Clock, ArrowDownRight, ToggleLeft, ToggleRight } from "lucide-react";

interface LifeEventsEditorProps {
  events: LifeEvent[];
  onChange: (events: LifeEvent[]) => void;
}

const EVENT_TYPES: { type: LifeEventType; label: string; icon: React.ReactNode }[] = [
  { type: "child", label: "Child", icon: <Baby className="w-3.5 h-3.5" /> },
  { type: "career_break", label: "Career Break", icon: <Clock className="w-3.5 h-3.5" /> },
  { type: "career_change", label: "Career Change", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { type: "inheritance", label: "Inheritance", icon: <Gift className="w-3.5 h-3.5" /> },
  { type: "redundancy", label: "Redundancy", icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
  { type: "part_time", label: "Part-Time", icon: <Clock className="w-3.5 h-3.5" /> },
  { type: "retirement", label: "Retirement", icon: <ArrowDownRight className="w-3.5 h-3.5" /> },
];

function formatMonthsFromNow(months: number): string {
  const years = Math.floor(months / 12);
  const m = months % 12;
  if (years === 0) return `${m} months`;
  if (m === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years}y ${m}m`;
}

export default function LifeEventsEditor({ events, onChange }: LifeEventsEditorProps) {
  const update = (id: string, updates: Partial<LifeEvent>) => {
    onChange(events.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const remove = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  const addEvent = (type: LifeEventType) => {
    let newEvent: LifeEvent;
    switch (type) {
      case "child":
        newEvent = createChildEvent(24);
        break;
      case "career_break":
        newEvent = createCareerBreakEvent(36, 6, "person1");
        break;
      case "inheritance":
        newEvent = createInheritanceEvent(120, 100000);
        break;
      case "retirement":
        newEvent = createRetirementEvent(300, "person1", 35000);
        break;
      default: {
        const id = `event_${Date.now().toString(36)}`;
        const paramsMap: Record<string, LifeEvent["params"]> = {
          career_change: { type: "career_change", person: "person1", newSalary: 80000, newGrowthRate: 3 },
          redundancy: { type: "redundancy", person: "person1", statutoryWeeks: 12, contractualMonths: 3, contractualMultiplier: 1.5 },
          part_time: { type: "part_time", person: "person2", hoursReductionPercent: 40 },
        };
        newEvent = {
          id,
          type,
          name: EVENT_TYPES.find((t) => t.type === type)?.label || type,
          startMonth: 24,
          durationMonths: 12,
          enabled: true,
          params: paramsMap[type] || { type: "career_break", person: "person1", incomeReductionPercent: 100 },
        };
        break;
      }
    }
    onChange([...events, newEvent]);
  };

  return (
    <div className="space-y-3">
      {events.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">
          No life events configured. Add events below to see how they affect your projection.
        </p>
      )}

      {events.map((event) => (
        <div
          key={event.id}
          className={`border rounded-xl p-4 ${event.enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => update(event.id, { enabled: !event.enabled })}
                className="text-slate-400 hover:text-blue-600"
              >
                {event.enabled ? <ToggleRight className="w-5 h-5 text-blue-600" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={event.name}
                onChange={(e) => update(event.id, { name: e.target.value })}
                className="text-sm font-semibold text-slate-900 bg-transparent border-none focus:outline-none"
              />
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {formatMonthsFromNow(event.startMonth)} from now
              </span>
            </div>
            <button onClick={() => remove(event.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Starts (months from now)</label>
              <input
                type="number"
                value={event.startMonth}
                onChange={(e) => update(event.id, { startMonth: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {event.durationMonths !== undefined && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Duration (months)</label>
                <input
                  type="number"
                  value={event.durationMonths}
                  onChange={(e) => update(event.id, { durationMonths: parseInt(e.target.value) || 1 })}
                  min={1}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Event-specific params */}
            {event.params.type === "child" && (
              <>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Nursery /month</label>
                  <input
                    type="number"
                    value={(event.params as ChildEventParams).nurseryCostMonthly}
                    onChange={(e) => update(event.id, { params: { ...event.params, nurseryCostMonthly: parseFloat(e.target.value) || 0 } as ChildEventParams })}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">School fees /month</label>
                  <input
                    type="number"
                    value={(event.params as ChildEventParams).schoolFeeMonthly}
                    onChange={(e) => update(event.id, { params: { ...event.params, schoolFeeMonthly: parseFloat(e.target.value) || 0 } as ChildEventParams })}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {event.params.type === "inheritance" && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Amount</label>
                <input
                  type="number"
                  value={(event.params as InheritanceParams).amount}
                  onChange={(e) => update(event.id, { params: { ...event.params, amount: parseFloat(e.target.value) || 0 } as InheritanceParams })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {event.params.type === "career_change" && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">New Salary</label>
                <input
                  type="number"
                  value={(event.params as CareerChangeParams).newSalary}
                  onChange={(e) => update(event.id, { params: { ...event.params, newSalary: parseFloat(e.target.value) || 0 } as CareerChangeParams })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {event.params.type === "part_time" && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hours Reduction %</label>
                <input
                  type="number"
                  value={(event.params as PartTimeParams).hoursReductionPercent}
                  onChange={(e) => update(event.id, { params: { ...event.params, hoursReductionPercent: parseFloat(e.target.value) || 0 } as PartTimeParams })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {event.params.type === "retirement" && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Target Income /year</label>
                <input
                  type="number"
                  value={(event.params as RetirementParams).targetAnnualIncome}
                  onChange={(e) => update(event.id, { params: { ...event.params, targetAnnualIncome: parseFloat(e.target.value) || 0 } as RetirementParams })}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Event Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        {EVENT_TYPES.map((et) => (
          <button
            key={et.type}
            onClick={() => addEvent(et.type)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            {et.icon}
            {et.label}
          </button>
        ))}
      </div>
    </div>
  );
}
