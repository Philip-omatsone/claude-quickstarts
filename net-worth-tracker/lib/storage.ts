import { MonthlySnapshot, Category, PropertyData, PensionEntry, EquityExposureEntry } from "./types";

const STORAGE_KEY = "net-worth-tracker-snapshots";
const PROPERTY_KEY = "net-worth-tracker-properties";
const PENSION_KEY = "net-worth-tracker-pensions";
const EQUITY_KEY = "net-worth-tracker-equity-exposure";

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

// ─── Snapshots ───────────────────────────────────────────────────────

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

// ─── Property Data ───────────────────────────────────────────────────

export function loadProperties(): PropertyData[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PROPERTY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveProperties(properties: PropertyData[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROPERTY_KEY, JSON.stringify(properties));
}

// ─── Pension Data ────────────────────────────────────────────────────

export function loadPensions(): PensionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PENSION_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function savePensions(pensions: PensionEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENSION_KEY, JSON.stringify(pensions));
}

// ─── Equity Exposure Data ────────────────────────────────────────────

export function loadEquityExposure(): EquityExposureEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(EQUITY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveEquityExposure(entries: EquityExposureEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EQUITY_KEY, JSON.stringify(entries));
}
