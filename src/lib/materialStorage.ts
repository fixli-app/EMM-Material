import { materials, type Material } from "@/data/materials";

const COMPARE_STORAGE_KEY = "hoganas-compare";

export function loadComparedMaterials(): Material[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(COMPARE_STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];

    const ids = stored
      .map((item) => (typeof item === "string" ? item : item && typeof item === "object" && "id" in item ? item.id : null))
      .filter((id): id is string => typeof id === "string");

    return [...new Set(ids)]
      .map((id) => materials.find((material) => material.id === id))
      .filter((material): material is Material => Boolean(material))
      .slice(0, 5);
  } catch {
    return [];
  }
}

export function saveComparedMaterials(selected: Material[]) {
  try {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(selected.map((material) => material.id)));
  } catch {
    // Keep comparison usable for the current page if browser storage is unavailable.
  }
}