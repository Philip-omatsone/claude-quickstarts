import { MonthlySnapshot } from "./types";

const STORAGE_KEY = "net-worth-tracker-snapshots";

export function loadSnapshots(): MonthlySnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveSnapshots(snapshots: MonthlySnapshot[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
}

export function addSnapshot(snapshot: MonthlySnapshot): MonthlySnapshot[] {
  const snapshots = loadSnapshots();
  const existingIndex = snapshots.findIndex((s) => s.month === snapshot.month);
  if (existingIndex >= 0) {
    snapshots[existingIndex] = snapshot;
  } else {
    snapshots.push(snapshot);
  }
  saveSnapshots(snapshots);
  return snapshots;
}

export function deleteSnapshot(month: string): MonthlySnapshot[] {
  const snapshots = loadSnapshots().filter((s) => s.month !== month);
  saveSnapshots(snapshots);
  return snapshots;
}
