import { MonthlySnapshot, Category } from "./types";

const STORAGE_KEY = "net-worth-tracker-snapshots";

// Map old category names to new ones
const CATEGORY_MIGRATION: Record<string, Category> = {
  cash: "current_account",
  isa: "stocks_shares_isa",
  investment: "gia",
  pension: "pension",
  property: "property",
  other_asset: "other_asset",
  mortgage: "mortgage",
  debt: "debt",
  other_liability: "other_liability",
};

function migrateSnapshots(snapshots: MonthlySnapshot[]): MonthlySnapshot[] {
  let changed = false;
  const migrated = snapshots.map((snapshot) => ({
    ...snapshot,
    items: snapshot.items.map((item) => {
      const newCategory = CATEGORY_MIGRATION[item.category];
      if (newCategory && newCategory !== item.category) {
        changed = true;
        return { ...item, category: newCategory };
      }
      return item;
    }),
  }));
  if (changed) {
    saveSnapshots(migrated);
  }
  return migrated;
}

export function loadSnapshots(): MonthlySnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const snapshots = JSON.parse(data);
    return migrateSnapshots(snapshots);
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
