import { useState } from "react";
import { type Material } from "@/data/materials";
import Header from "@/components/Header";
import ApplicationGuide from "@/components/ApplicationGuide";

const Applications = () => {
  const [compareList, setCompareList] = useState<Material[]>(() => {
    try { return JSON.parse(localStorage.getItem("hoganas-compare") || "[]"); } catch { return []; }
  });

  const toggleCompare = (material: Material) => {
    setCompareList((prev) => {
      const exists = prev.some((m) => m.id === material.id);
      const next = exists ? prev.filter((m) => m.id !== material.id) : prev.length < 5 ? [...prev, material] : prev;
      localStorage.setItem("hoganas-compare", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ApplicationGuide onCompare={toggleCompare} compareList={compareList} />
    </div>
  );
};

export default Applications;
