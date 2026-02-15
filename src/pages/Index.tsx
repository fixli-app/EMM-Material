import { useState } from "react";
import { type Material } from "@/data/materials";
import Header from "@/components/Header";
import MaterialSelector from "@/components/MaterialSelector";

const Index = () => {
  // Shared compare state lifted to a simple approach per page
  // Using localStorage to share between pages
  const [compareList, setCompareList] = useState<Material[]>(() => {
    try {
      const stored = localStorage.getItem("hoganas-compare");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
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
      <MaterialSelector onCompare={toggleCompare} compareList={compareList} />
    </div>
  );
};

export default Index;
