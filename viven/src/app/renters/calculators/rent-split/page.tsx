"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import {
  CalculatorLayout,
  InputField,
  ResultCard,
  InsightBox,
  formatGBP,
} from "@/components/calculators/CalculatorLayout";

interface Room {
  name: string;
  sqm: number;
  hasEnsuite: boolean;
}

export default function RentSplitPage() {
  const [totalRent, setTotalRent] = useState(2400);
  const [rooms, setRooms] = useState<Room[]>([
    { name: "Room 1", sqm: 14, hasEnsuite: false },
    { name: "Room 2", sqm: 12, hasEnsuite: false },
    { name: "Room 3", sqm: 10, hasEnsuite: false },
  ]);

  const updateRoom = (index: number, field: keyof Room, value: string | number | boolean) => {
    const next = [...rooms];
    next[index] = { ...next[index], [field]: value };
    setRooms(next);
  };

  const addRoom = () => {
    setRooms([...rooms, { name: `Room ${rooms.length + 1}`, sqm: 12, hasEnsuite: false }]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length <= 2) return;
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const splits = useMemo(() => {
    // Weight by room size + ensuite bonus
    const weights = rooms.map((r) => r.sqm + (r.hasEnsuite ? 3 : 0));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    if (totalWeight <= 0) return rooms.map((r) => ({ name: r.name, share: Math.round(totalRent / rooms.length), pct: Math.round(100 / rooms.length) }));

    return rooms.map((r, i) => ({
      name: r.name,
      share: Math.round((weights[i] / totalWeight) * totalRent),
      pct: Math.round((weights[i] / totalWeight) * 100),
    }));
  }, [rooms, totalRent]);

  const equalSplit = Math.round(totalRent / rooms.length);

  return (
    <CalculatorLayout
      title="Fair Rent Split Calculator"
      subtitle="Split rent fairly based on room size"
      icon={Users}
      backHref="/renters/calculators"
      backLabel="All Calculators"
      methodology={`Rent is split proportionally based on room size (in square metres). Rooms with an en-suite bathroom get a bonus weighting equivalent to +3m². This gives a fairer split than dividing equally, especially when rooms vary in size.`}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-6">
            <InputField label="Total monthly rent" value={totalRent} onChange={(v) => setTotalRent(Number(v) || 0)} prefix="£" />
          </div>

          <div className="bg-white rounded-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Rooms</h3>
            {rooms.map((room, i) => (
              <div key={i} className="p-3 bg-background rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={room.name}
                    onChange={(e) => updateRoom(i, "name", e.target.value)}
                    className="text-sm font-medium bg-transparent border-none focus:outline-none"
                  />
                  {rooms.length > 2 && (
                    <button onClick={() => removeRoom(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <InputField label="Size (m²)" value={room.sqm} onChange={(v) => updateRoom(i, "sqm", Number(v) || 0)} suffix="m²" />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer mt-5">
                    <input
                      type="checkbox"
                      checked={room.hasEnsuite}
                      onChange={(e) => updateRoom(i, "hasEnsuite", e.target.checked)}
                      className="accent-primary"
                    />
                    En-suite
                  </label>
                </div>
              </div>
            ))}
            <button onClick={addRoom} className="text-sm text-primary font-medium hover:text-primary-dark">
              + Add room
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Equal split" value={`${formatGBP(equalSplit)}/mo each`} />
            <ResultCard label="People" value={`${rooms.length}`} />
          </div>

          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Fair Split by Room</h3>
            <div className="space-y-3">
              {splits.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-sm font-bold text-primary">{formatGBP(s.share)}/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-xs text-muted w-8 text-right">{s.pct}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted">
                      {rooms[i].sqm}m² {rooms[i].hasEnsuite ? "+ en-suite" : ""}
                    </span>
                    {s.share !== equalSplit && (
                      <span className={`text-[11px] font-medium ${s.share > equalSplit ? "text-red-500" : "text-green-600"}`}>
                        ({s.share > equalSplit ? "+" : ""}{formatGBP(s.share - equalSplit)} vs equal)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InsightBox>
        <p>
          A fair split based on room size avoids the common argument about who pays what. The person with the biggest room pays proportionally more. En-suite rooms get a small premium. Share this result with your housemates to agree before signing.
        </p>
      </InsightBox>
    </CalculatorLayout>
  );
}
